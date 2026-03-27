"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { Download, FileText, X, FileDown } from "lucide-react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

// ─── PDF Generator ────────────────────────────────────────────────────────────
function generateInvoicePDF(inv) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297;
  const M = 18;

  // helpers
  const rr = (x, y, w, h, r, fill, stroke) => {
    doc.setDrawColor(stroke?.[0] ?? 255, stroke?.[1] ?? 255, stroke?.[2] ?? 255);
    doc.setFillColor(fill[0], fill[1], fill[2]);
    doc.roundedRect(x, y, w, h, r, r, fill ? (stroke ? "FD" : "F") : "D");
  };

  const PURPLE    = [124, 58, 237];
  const LIGHT_BG  = [245, 243, 255];
  const DARK      = [26, 26, 46];
  const MUTED     = [107, 114, 128];
  const WHITE     = [255, 255, 255];
  const LINE      = [229, 231, 235];

  const order = inv.orderId ?? {};
  const statusColors = {
    paid:    { bg: [220, 252, 231], fg: [22, 163, 74]  },
    unpaid:  { bg: [254, 226, 226], fg: [220, 38, 38]  },
    pending: { bg: [254, 243, 199], fg: [217, 119, 6]  },
  };
  const sc = statusColors[inv.status] ?? statusColors.pending;

  // ── Header banner
  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, W, 55, "F");

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text("INVOICE", M, 28);

  // underline
  doc.setDrawColor(167, 139, 250);
  doc.setLineWidth(0.7);
  doc.line(M, 31, M + 62, 31);

  // Meta right
  const invId = String(inv._id).slice(-6).toUpperCase();
  let fmtDate = inv.createdAt ?? "";
  try {
    fmtDate = new Date(inv.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch (_) {}

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(221, 214, 254);
  doc.text(fmtDate, W - M, 22, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text(`Invoice No.  #${invId}`, W - M, 29, { align: "right" });

  // Status badge
  rr(W - M - 22, 35, 22, 8, 2, sc.bg);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...sc.fg);
  doc.text(inv.status.toUpperCase(), W - M - 11, 40.5, { align: "center" });

  // ── Billed To / From cards
  const cardTop = 60, cardH = 40, cardW = (W - 2 * M - 6) / 2;

  rr(M, cardTop, cardW, cardH, 3, LIGHT_BG);
  doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(...PURPLE);
  doc.text("BILLED TO", M + 4, cardTop + 7);
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
  doc.text(inv.customerName ?? "—", M + 4, cardTop + 14);
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED);
  doc.text(`Machine: ${order.machineName ?? "—"}`, M + 4, cardTop + 21);
  const prob = (order.problemDescription ?? "").slice(0, 55);
  doc.text(`Issue: ${prob}`, M + 4, cardTop + 27);

  const rx = M + cardW + 6;
  rr(rx, cardTop, cardW, cardH, 3, LIGHT_BG);
  doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(...PURPLE);
  doc.text("FROM", rx + 4, cardTop + 7);
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
  doc.text("Nitin Katyare", rx + 4, cardTop + 14);
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED);
  doc.text("Nitin Machinery Services", rx + 4, cardTop + 21);
  doc.text("593, Near Ronak Lawn, Pune Highway", rx + 4, cardTop + 27);
  doc.text("Sinnar, Nashik, Maharashtra - 422103", rx + 4, cardTop + 33);

  // ── Table
  const tblTop = cardTop + cardH + 12;
  const tblW   = W - 2 * M;
  const rowH   = 9;
  const cols   = [M, M + 75, M + 105, M + 135, W - M];

  rr(M, tblTop, tblW, rowH, 3, PURPLE);
  const hdrs = ["Description", "Order ID", "Date", "Amount"];
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
  hdrs.forEach((h, i) => {
    doc.text(h, (cols[i] + cols[i + 1]) / 2, tblTop + 6, { align: "center" });
  });

  rr(M, tblTop + rowH, tblW, rowH, 3, LIGHT_BG);
  let orderDate = "";
  try { orderDate = new Date(order.createdAt).toLocaleDateString("en-IN"); } catch (_) {}
  const oid = String(order._id ?? "").slice(-8).toUpperCase();
  const rowData = [
    order.machineName ?? "Machinery Service",
    `#${oid}`,
    orderDate,
    `Rs. ${Number(inv.amount).toLocaleString("en-IN")}`,
  ];
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...DARK);
  rowData.forEach((v, i) => {
    if (i === 3) { doc.setFont("helvetica", "bold"); doc.setTextColor(...PURPLE); }
    doc.text(v, (cols[i] + cols[i + 1]) / 2, tblTop + rowH + 6, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(...DARK);
  });

  // ── Totals box
  const totTop = tblTop + rowH * 2 + 8;
  const totX   = W - M - 70, totW = 70, totH = 32;
  rr(totX, totTop, totW, totH, 3, LIGHT_BG);

  const drawTotRow = (lbl, val, yOff, bold = false, big = false) => {
    doc.setFontSize(big ? 11 : 8);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...(bold ? PURPLE : MUTED));
    doc.text(lbl, totX + 4, totTop + yOff);
    doc.setTextColor(...(bold ? PURPLE : DARK));
    doc.text(val, totX + totW - 4, totTop + yOff, { align: "right" });
  };

  const amt = Number(inv.amount);
  drawTotRow("Subtotal", `Rs. ${amt.toLocaleString("en-IN")}`, 10);
  drawTotRow("Tax (0%)", "Rs. 0", 17);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(totX + 4, totTop + 20, totX + totW - 4, totTop + 20);
  drawTotRow("TOTAL", `Rs. ${amt.toLocaleString("en-IN")}`, 27, true, true);

  // ── Payment + Contact cards
  const payTop = totTop + totH + 10;
  const half   = (W - 2 * M - 6) / 2;
  const payH   = 35;

  rr(M, payTop, half, payH, 3, LIGHT_BG);
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...PURPLE);
  doc.text("PAYMENT INFORMATION", M + 4, payTop + 8);
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED);
  doc.text("Bank:  Nitin Machinery Bank",  M + 4, payTop + 15);
  doc.text("Account No:  1234 5678 9012",  M + 4, payTop + 21);
  doc.text("IFSC:  NITM0001234",           M + 4, payTop + 27);
  doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
  doc.text("UPI: nitinkatyare@upi",        M + 4, payTop + 33);

  const cx2 = M + half + 6;
  rr(cx2, payTop, half, payH, 3, LIGHT_BG);
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...PURPLE);
  doc.text("CONTACT", cx2 + 4, payTop + 8);
  doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED);
  doc.text("Nitin Katyare",               cx2 + 4, payTop + 15);
  doc.text("+91 98501 30575 | +91 96995 77380", cx2 + 4, payTop + 21);
  doc.text("info@nitinmachinery.in",      cx2 + 4, payTop + 27);
  doc.text("nitinmachinery.in",           cx2 + 4, payTop + 33);

  // ── Thank you note
  doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(...MUTED);
  doc.text(
    "Thank you for your business! Payment is due within 30 days of invoice date.",
    W / 2, payTop + payH + 8, { align: "center" }
  );

  // ── Footer bar
  doc.setFillColor(...PURPLE);
  doc.rect(0, H - 10, W, 10, "F");
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...WHITE);
  doc.text(
    "Nitin Machinery Services  •  593, Near Ronak Lawn, Sinnar, Nashik 422103  •  +91 98501 30575",
    W / 2, H - 3.5, { align: "center" }
  );

  doc.save(`invoice_${invId}.pdf`);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ orderId: "", customerName: "", amount: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/invoice", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Failed to load invoices"); return; }
      setInvoices(data.data);
    } catch { toast.error("Server error"); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/service", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.data.filter((o) => o.status === "completed"));
    } catch { toast.error("Failed to load orders"); }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleCreateInvoice = async () => {
    if (!form.orderId || !form.customerName || !form.amount) {
      toast.error("All fields are required"); return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: form.orderId, customerName: form.customerName, amount: Number(form.amount) }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed to create invoice"); return; }
      toast.success("Invoice created ✅");
      setShowModal(false);
      setForm({ orderId: "", customerName: "", amount: "" });
      fetchInvoices();
    } catch { toast.error("Server error"); }
    finally { setSubmitting(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/invoice/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { toast.error("Failed to update status"); return; }
      toast.success("Status updated ✅");
      fetchInvoices();
    } catch { toast.error("Server error"); }
  };

  const exportToCSV = () => {
    if (!invoices.length) { toast.error("No data to export"); return; }
    const headers = ["Invoice ID", "Customer", "Amount", "Date", "Status"];
    const rows = invoices.map((inv) => [
      inv._id, inv.customerName, inv.amount,
      new Date(inv.createdAt).toLocaleDateString(), inv.status,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "invoices.csv"; link.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: "Invoice ID", accessor: "_id",
      cell: (row) => (
        <span className="font-mono text-xs text-zinc-500">#{row._id.slice(-6).toUpperCase()}</span>
      ),
    },
    { header: "Customer", accessor: "customerName" },
    {
      header: "Amount", accessor: "amount",
      cell: (row) => <span className="font-semibold text-zinc-900">₹{row.amount.toLocaleString("en-IN")}</span>,
    },
    {
      header: "Date", accessor: "createdAt",
      cell: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
    },
    {
      header: "Status", accessor: "status",
      cell: (row) => {
        const styles = {
          paid: "bg-green-50 text-green-700 ring-green-600/20",
          unpaid: "bg-red-50 text-red-700 ring-red-600/20",
          pending: "bg-orange-50 text-orange-700 ring-orange-600/20",
        };
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-inset ${styles[row.status] || "bg-gray-100"}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  const actions = (row) => (
    <div className="flex gap-2 items-center">
      {row.status !== "paid" && (
        <Button onClick={() => updateStatus(row._id, "paid")} className="h-8 px-2 text-xs">Mark Paid</Button>
      )}
      {row.status === "pending" && (
        <Button onClick={() => updateStatus(row._id, "unpaid")} className="h-8 px-2 text-xs">Mark Unpaid</Button>
      )}
      {/* ✅ Download PDF per invoice */}
      <Button
        onClick={() => { generateInvoicePDF(row); toast.success("PDF downloaded!"); }}
        className="h-8 px-2 text-xs flex items-center gap-1"
        title="Download Invoice PDF"
      >
        <FileDown className="h-3 w-3" /> PDF
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Invoices</h1>
          <p className="text-zinc-500 mt-1">Manage and track all invoices</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => { fetchOrders(); setShowModal(true); }}>
            <FileText className="mr-2 h-4 w-4" /> Generate Invoice
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading invoices...</div>
      ) : (
        <Table columns={columns} data={invoices} actions={actions} />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Generate Invoice</h2>
            <p className="text-sm text-zinc-500 mb-6">Create a new invoice for a completed order</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Select Order</label>
                <select
                  value={form.orderId}
                  onChange={(e) => {
                    const selected = orders.find((o) => o._id === e.target.value);
                    setForm({ orderId: e.target.value, customerName: selected?.customer?.name || "", amount: "" });
                  }}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">-- Select a completed order --</option>
                  {orders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.machineName} — {order.customer?.name || "Unknown"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Customer Name</label>
                <input
                  type="text" value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Amount (₹)</label>
                <input
                  type="number" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <Button onClick={handleCreateInvoice} disabled={submitting} className="w-full mt-2">
                {submitting ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
