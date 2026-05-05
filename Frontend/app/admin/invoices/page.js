"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { Download, FileText, X, FileDown } from "lucide-react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

export function generateInvoicePDF(inv) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ─── Page geometry ───────────────────────────────────────────────────────────
  const PW = 210; // page width
  const PH = 297; // page height
  const ML = 15; // left margin
  const MR = 15; // right margin
  const CW = PW - ML - MR; // content width

  // ─── Colour palette (B&W only) ────────────────────────────────────────────
  const BLACK = [0, 0, 0];
  const WHITE = [255, 255, 255];
  const DARK = [30, 30, 30];
  const GREY = [80, 80, 80];
  const LGREY = [180, 180, 180];
  const BGLT = [245, 245, 245]; // very light grey for alternating rows

  // ─── Typography helpers ───────────────────────────────────────────────────
  const bold = (sz) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(sz);
  };
  const normal = (sz) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(sz);
  };
  const italic = (sz) => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(sz);
  };
  const setColor = (rgb) => {
    doc.setTextColor(...rgb);
  };

  // ─── Draw helpers ─────────────────────────────────────────────────────────
  const hline = (y, x1 = ML, x2 = ML + CW, lw = 0.3, color = LGREY) => {
    doc.setLineWidth(lw);
    doc.setDrawColor(...color);
    doc.line(x1, y, x2, y);
  };
  const thickHline = (y) => hline(y, ML, ML + CW, 0.8, BLACK);
  const filledRect = (x, y, w, h, fill) => {
    doc.setFillColor(...fill);
    doc.rect(x, y, w, h, "F");
  };

  // ─── Data extraction ─────────────────────────────────────────────────────
  const order = inv.orderId ?? inv.order ?? {};

  // Invoice ID
  let invId;
  if (inv._id) invId = inv._id.slice(-8).toUpperCase();
  else if (order._id) invId = order._id.slice(-8).toUpperCase();
  else if (order.orderId) invId = order.orderId.slice(-8).toUpperCase();
  else invId = Math.random().toString(36).slice(2, 10).toUpperCase();

  // Dates
  const srcDate = inv.createdAt || order.createdAt;
  const invoiceDate = srcDate
    ? new Date(srcDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const dueDateObj = srcDate ? new Date(srcDate) : new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 30);
  const dueDate = dueDateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Status
  const rawStatus = (inv.status || "unpaid").toLowerCase();
  const statusLabel = rawStatus.toUpperCase();

  // ─── CUSTOMER DATA EXTRACTION (FIXED) ─────────────────────────────────────
  // Try multiple data sources
  const customerObj = inv.customer || order.customer || {};

  const customerName =
    inv.customerName || customerObj.name || order.customerName || "—";

  const customerAddr =
    inv.customerAddress || customerObj.address || order.customerAddress || "—";

  const customerPhone =
    inv.contactNumber ||
    inv.phone ||
    customerObj.contactNumber ||
    customerObj.phone ||
    order.contactNumber ||
    "—";

  // GSTIN - with proper handling
  const customerGSTIN =
    inv.customerGSTIN ||
    customerObj.gstin ||
    customerObj.gstNumber ||
    inv.gstin ||
    "URP"; // Unregistered Person

  // ─── STATE DETECTION FOR GST CALCULATION ──────────────────────────────────
  // Default to Maharashtra (Intra-state = CGST + SGST)
  // Extract state code from customer address or use a mapping
  const getStateFromAddress = (address) => {
    if (!address) return "27"; // Maharashtra default
    const addr = address.toUpperCase();
    if (addr.includes("MAHARASHTRA")) return "27";
    if (addr.includes("KARNATAKA")) return "29";
    if (addr.includes("TAMIL NADU")) return "33";
    if (addr.includes("TELANGANA")) return "36";
    if (addr.includes("RAJASTHAN")) return "08";
    if (addr.includes("DELHI")) return "07";
    if (addr.includes("GUJARAT")) return "24";
    if (addr.includes("HARYANA")) return "06";
    if (addr.includes("PUNJAB")) return "03";
    if (addr.includes("UTTAR PRADESH")) return "09";
    return "27"; // Default to Maharashtra
  };

  const stateCode = getStateFromAddress(customerAddr);
  const isIntraState = stateCode === "27"; // Maharashtra

  // Service details
  const machineName = order.machineName || inv.machine || "—";
  const orderDisplayId =
    order.orderId || (order._id ? order._id.slice(-8).toUpperCase() : "N/A");

  let problemDesc = order.problemDescription || inv.issue || "—";
  if (problemDesc.length > 90) problemDesc = problemDesc.slice(0, 87) + "...";

  // Amounts
  let taxableAmount = 0;
  const raw = inv.amount ?? inv.taxableAmount ?? order.amount ?? 0;
  if (typeof raw === "number") {
    taxableAmount = raw;
  } else {
    taxableAmount = parseFloat(String(raw).replace(/[^\d.]/g, "")) || 0;
  }

  // ─── GST CALCULATION (FIXED FOR IGST) ──────────────────────────────────────
  let cgstAmt = 0;
  let sgstAmt = 0;
  let igstAmt = 0;
  let totalGST = 0;
  let gstLabel = "";

  if (isIntraState) {
    // Intra-state: CGST 9% + SGST 9% (for SAC 998719)
    const cgstRate = 0.09;
    const sgstRate = 0.09;
    cgstAmt = taxableAmount * cgstRate;
    sgstAmt = taxableAmount * sgstRate;
    totalGST = cgstAmt + sgstAmt;
    gstLabel = "CGST+SGST";
  } else {
    // Inter-state: IGST 18% (for SAC 998719)
    const igstRate = 0.18;
    igstAmt = taxableAmount * igstRate;
    totalGST = igstAmt;
    gstLabel = "IGST";
  }

  const grandTotal = taxableAmount + totalGST;

  const fmt = (n) =>
    `Rs. ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ─── Amount-in-words ─────────────────────────────────────────────────────
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  function numToWords(n) {
    n = Math.round(n);
    if (n === 0) return "Zero";
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + numToWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        numToWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + numToWords(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        numToWords(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + numToWords(n % 100000) : "")
      );
    return (
      numToWords(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + numToWords(n % 10000000) : "")
    );
  }
  const amtWords = numToWords(Math.round(grandTotal)) + " Rupees Only";

  // ═══════════════════════════════════════════════════════════════════════════
  //  LAYOUT — top → bottom
  // ═══════════════════════════════════════════════════════════════════════════

  let Y = 14; // running cursor

  // ─── 1. Header bar ────────────────────────────────────────────────────────
  filledRect(0, 0, PW, 26, BLACK);

  bold(18);
  setColor(WHITE);
  doc.text("NITIN MACHINERY SERVICES", ML, 12);

  normal(7.5);
  doc.text("Sinnar, Nashik, Maharashtra — 422 103", ML, 18);
  doc.text("Ph: +91 98501 30575  |  GSTIN: 27XXXXX0000X1ZX", ML, 23);

  bold(9);
  doc.text("TAX INVOICE", PW - MR, 12, { align: "right" });
  normal(7.5);
  doc.text("(Original for Recipient)", PW - MR, 18, { align: "right" });

  Y = 34;

  // ─── 2. Invoice meta strip ────────────────────────────────────────────────
  thickHline(Y - 2);

  bold(8.5);
  setColor(DARK);
  doc.text(`Invoice No.: INV-${invId}`, ML, Y + 4);
  doc.text(`Invoice Date: ${invoiceDate}`, ML, Y + 10);
  doc.text(`Due Date: ${dueDate}`, ML, Y + 16);

  doc.text(`Status: ${statusLabel}`, PW - MR, Y + 4, { align: "right" });
  doc.text(`SAC Code: 998719`, PW - MR, Y + 10, { align: "right" });
  doc.text(`Place of Supply: Maharashtra (${stateCode})`, PW - MR, Y + 16, {
    align: "right",
  });

  Y += 22;
  thickHline(Y);

  // ─── 3. Bill To / Ship To ────────────────────────────────────────────────
  Y += 5;

  const colMid = ML + CW / 2;

  bold(8);
  setColor(GREY);
  doc.text("BILL TO", ML, Y);
  doc.text("SERVICE DETAILS", colMid + 2, Y);

  hline(Y + 1, ML, colMid - 2);
  hline(Y + 1, colMid + 2, ML + CW);

  Y += 6;

  bold(9);
  setColor(DARK);
  doc.text(customerName, ML, Y);

  normal(8);
  setColor(GREY);
  // wrap address if long
  const addrLines = doc.splitTextToSize(customerAddr, 80);
  addrLines.forEach((line, i) => doc.text(line, ML, Y + 5 + i * 5));
  const addrH = addrLines.length * 5;

  doc.text(`GSTIN: ${customerGSTIN}`, ML, Y + 5 + addrH);
  doc.text(`Ph: ${customerPhone}`, ML, Y + 10 + addrH);

  // Right column — service details
  bold(8.5);
  setColor(DARK);
  doc.text(`Machine: ${machineName}`, colMid + 2, Y);
  normal(8);
  setColor(GREY);
  doc.text(`Order Ref: #${orderDisplayId}`, colMid + 2, Y + 6);
  const descLines = doc.splitTextToSize(`Problem: ${problemDesc}`, 80);
  descLines.forEach((line, i) => doc.text(line, colMid + 2, Y + 12 + i * 5));

  Y += 22 + Math.max(addrH, descLines.length * 5);
  thickHline(Y);

  // ─── 4. Items table ──────────────────────────────────────────────────────
  Y += 2;

  const tRowH = 7;

  // Table header - Dynamic based on GST type
  filledRect(ML, Y, CW, tRowH, BLACK);
  bold(7.5);
  setColor(WHITE);
  doc.text("#", ML + 1, Y + 5);
  doc.text("Description of Service", ML + 7, Y + 5);
  doc.text("SAC", ML + 92, Y + 5, { align: "center" });
  doc.text("Taxable Amt (Rs.)", ML + 120, Y + 5, { align: "right" });

  if (isIntraState) {
    doc.text("CGST @9%", ML + 148, Y + 5, { align: "right" });
    doc.text("SGST @9%", ML + 164, Y + 5, { align: "right" });
  } else {
    doc.text("IGST @18%", ML + 148, Y + 5, { align: "right" });
  }

  doc.text("Total (Rs.)", ML + CW, Y + 5, { align: "right" });

  Y += tRowH;

  // Single data row
  filledRect(ML, Y, CW, tRowH + 2, BGLT);
  normal(8);
  setColor(DARK);

  const serviceDesc = `Repair & Maintenance — ${machineName}`;
  doc.text("1", ML + 1, Y + 6);
  doc.text(serviceDesc, ML + 7, Y + 6);
  doc.text("998719", ML + 92, Y + 6, { align: "center" });
  doc.text(taxableAmount.toFixed(2), ML + 120, Y + 6, { align: "right" });

  if (isIntraState) {
    doc.text(cgstAmt.toFixed(2), ML + 148, Y + 6, { align: "right" });
    doc.text(sgstAmt.toFixed(2), ML + 164, Y + 6, { align: "right" });
  } else {
    doc.text(igstAmt.toFixed(2), ML + 148, Y + 6, { align: "right" });
  }

  doc.text(grandTotal.toFixed(2), ML + CW, Y + 6, { align: "right" });

  Y += tRowH + 2;
  hline(Y, ML, ML + CW, 0.5, DARK);

  // ─── 5. Totals block ─────────────────────────────────────────────────────
  Y += 4;

  const tX = ML + CW - 90; // left edge of totals table
  const tW = 90;
  const tLH = 7;

  const totRow = (label, value, isBold = false) => {
    isBold ? bold(8.5) : normal(8);
    setColor(DARK);
    doc.text(label, tX, Y + 5);
    doc.text(value, tX + tW, Y + 5, { align: "right" });
    Y += tLH;
  };

  totRow("Taxable Amount", `Rs. ${taxableAmount.toFixed(2)}`);
  hline(Y - 1, tX, tX + tW);

  if (isIntraState) {
    totRow("CGST @ 9%", `Rs. ${cgstAmt.toFixed(2)}`);
    totRow("SGST @ 9%", `Rs. ${sgstAmt.toFixed(2)}`);
  } else {
    totRow("IGST @ 18%", `Rs. ${igstAmt.toFixed(2)}`);
  }

  hline(Y - 1, tX, tX + tW, 0.5, DARK);
  totRow("Total Tax (GST)", `Rs. ${totalGST.toFixed(2)}`);
  hline(Y - 1, tX, tX + tW, 0.5, DARK);
  filledRect(tX - 2, Y - 1, tW + 4, tLH + 2, BLACK);
  bold(10);
  setColor(WHITE);
  doc.text("GRAND TOTAL", tX, Y + 6);
  doc.text(grandTotal.toFixed(2), tX + tW, Y + 6, { align: "right" });
  setColor(DARK);
  Y += tLH + 6;

  // Amount in words
  normal(8);
  setColor(GREY);
  const wordsLines = doc.splitTextToSize(
    `Amount in Words: ${amtWords}`,
    CW - 5,
  );
  wordsLines.forEach((line) => {
    doc.text(line, ML, Y);
    Y += 5;
  });

  Y += 4;
  thickHline(Y);
  
  // ─── 7. Signature & Declaration ──────────────────────────────────────────
  Y += 6;

  normal(7.5);
  setColor(GREY);
  const decl =
    "We hereby certify that the services mentioned in this invoice have been rendered and the amount shown represents the true and correct value of such services.";
  const declLines = doc.splitTextToSize(decl, CW * 0.55);
  declLines.forEach((line) => {
    doc.text(line, ML, Y);
    Y += 4.5;
  });

  // Signature box — right
  const sigX = ML + CW - 60;
  const sigY = Y - declLines.length * 4.5 - 2;
  doc.rect(sigX, sigY, 60, 22);
  bold(8);
  setColor(DARK);
  doc.text("For Nitin Machinery Services", sigX + 30, sigY + 4, {
    align: "center",
  });
  normal(7.5);
  setColor(GREY);
  doc.text("Authorised Signatory", sigX + 30, sigY + 18, { align: "center" });

  // ─── 8. Footer ────────────────────────────────────────────────────────────
  filledRect(0, PH - 10, PW, 10, BLACK);
  bold(7);
  setColor(WHITE);
  doc.text(
    "Nitin Machinery Services  |  Sinnar, Nashik, Maharashtra  |  +91 98501 30575",
    PW / 2,
    PH - 4,
    { align: "center" },
  );

  // ─── Save ─────────────────────────────────────────────────────────────────
  doc.save(`invoice_INV-${invId}.pdf`);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    orderId: "",
    customerName: "",
    amount: "",
    customerAddress: "",
    customerPhone: "",
    customerGSTIN: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const availableOrders = orders.filter(
    (order) => !invoices.some((inv) => inv.orderId?._id === order._id),
  );

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load invoices");
        return;
      }
      setInvoices(data.data);
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/service`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const filtered = data.data.filter((o) => o.status === "completed");
      setOrders(filtered);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchOrders();
  }, []);

  const handleCreateInvoice = async () => {
    if (!form.orderId || !form.customerName || !form.amount) {
      toast.error("Order, customer name, and amount are required");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: form.orderId,
          customerName: form.customerName,
          customerAddress: form.customerAddress,
          contactNumber: form.customerPhone,
          customerGSTIN: form.customerGSTIN || "URP",
          amount: Number(form.amount),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to create invoice");
        return;
      }
      toast.success("Invoice created ✅");
      setShowModal(false);
      setForm({
        orderId: "",
        customerName: "",
        amount: "",
        customerAddress: "",
        customerPhone: "",
        customerGSTIN: "",
      });
      fetchInvoices();
    } catch {
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/invoice/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }
      toast.success("Status updated ✅");
      fetchInvoices();
    } catch {
      toast.error("Server error");
    }
  };

  const exportToCSV = () => {
    if (!invoices.length) {
      toast.error("No data to export");
      return;
    }
    const headers = ["Invoice ID", "Customer", "Phone", "Amount", "Date", "Status"];
    const rows = invoices.map((inv) => [
      inv._id,
      inv.customerName,
      inv.contactNumber || inv.phone || inv.customer?.contactNumber || inv.customer?.phone || inv.order?.contactNumber || "—",
      inv.amount,
      new Date(inv.createdAt).toLocaleDateString(),
      inv.status,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: "Invoice ID",
      accessor: "_id",
      cell: (row) => (
        <span className="font-mono text-xs text-zinc-500">
          #{row._id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    { header: "Customer", accessor: "customerName" },
    {
      header: "Phone",
      accessor: "contactNumber",
      cell: (row) => {
        const phone = row.contactNumber || row.phone || row.customer?.contactNumber || row.customer?.phone || row.order?.contactNumber || "—";
        return <span className="text-zinc-600">{phone}</span>;
      },
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-semibold text-zinc-900">
          ₹{row.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => {
        const styles = {
          paid: "bg-green-100 text-green-700",
          unpaid: "bg-red-100 text-red-700",
          pending: "bg-yellow-100 text-yellow-700",
          cancelled: "bg-gray-200 text-gray-600",
        };
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-inset ${styles[row.status] || "bg-gray-100"}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  const actions = (row) => {
    const status = row.status?.toLowerCase();

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {status !== "paid" && status !== "cancelled" && (
          <Button
            onClick={() => updateStatus(row._id, "paid")}
            className="h-7 px-2 text-[11px]"
          >
            Paid
          </Button>
        )}

        {status === "pending" && (
          <Button
            onClick={() => updateStatus(row._id, "unpaid")}
            className="h-7 px-2 text-[11px]"
          >
            Unpaid
          </Button>
        )}

        {status !== "paid" && status !== "cancelled" && (
          <Button
            variant="outline"
            onClick={() => updateStatus(row._id, "cancelled")}
            className="h-7 px-2 text-[11px] text-red-600 border-red-300 hover:bg-red-50"
          >
            Cancel
          </Button>
        )}

        <Button
          onClick={() => {
            generateInvoicePDF(row);
            toast.success("PDF downloaded!");
          }}
          className="h-7 px-2 text-[11px] flex items-center gap-1"
        >
          <FileDown className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Invoices</h1>
          <p className="text-sm text-zinc-500">Manage and track all invoices</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={exportToCSV} className="h-9 text-sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>

          <Button
            onClick={() => {
              setShowModal(true);
            }}
            className="h-9 text-sm"
          >
            <FileText className="mr-2 h-4 w-4" /> New Invoice
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading invoices...</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <Table columns={columns} data={invoices} actions={actions} />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-1 right-4 text-zinc-400 hover:text-zinc-700 sticky"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">
              Generate Invoice
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Create a new invoice for a completed order
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Select Order
                </label>
                <select
                  value={form.orderId}
                  onChange={(e) => {
                    const selected = availableOrders.find(
                      (o) => o._id === e.target.value,
                    );

                    setForm((prev) => ({
                      ...prev,
                      orderId: e.target.value,
                      customerName: selected?.customer?.name || "",
                      customerAddress: selected?.customer?.address || "",
                      customerPhone: selected?.customer?.contactNumber || "",
                      customerGSTIN: selected?.customer?.gstin || "",
                      amount: "",
                    }));
                  }}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">-- Select a completed order --</option>

                  {availableOrders.length === 0 ? (
                    <option disabled>No orders available</option>
                  ) : (
                    availableOrders.map((order) => (
                      <option key={order._id} value={order._id}>
                        {order.machineName} —{" "}
                        {order.customer?.name || "Unknown"}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                  }
                  placeholder="Customer name"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Customer Address
                </label>
                <input
                  type="text"
                  value={form.customerAddress}
                  onChange={(e) =>
                    setForm({ ...form, customerAddress: e.target.value })
                  }
                  placeholder="Customer address"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) =>
                    setForm({ ...form, customerPhone: e.target.value })
                  }
                  placeholder="Customer phone"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Customer GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={form.customerGSTIN}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customerGSTIN: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., 27XXXXX0000X1ZX or leave blank for URP"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <Button
                onClick={handleCreateInvoice}
                disabled={submitting}
                className="w-full mt-2"
              >
                {submitting ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
