"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { Download, FileText, X, FileDown } from "lucide-react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

export function generateInvoicePDF(inv) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const W = 210;
  const H = 297;
  const M = 18;

  // Colors
  const PURPLE = [79, 70, 229];
  const LIGHT_BG = [245, 243, 255];
  const DARK = [30, 41, 59];
  const MUTED = [100, 116, 139];
  const WHITE = [255, 255, 255];
  const LINE = [226, 232, 240];

  // Helper function
  const box = (x, y, w, h, fill) => {
    doc.setFillColor(...fill);
    doc.roundedRect(x, y, w, h, 3, 3, "F");
  };

  // Safely extract order data
  const order = inv.orderId ?? inv.order ?? {};

  // Determine status with fallback
  const status = inv.status || (inv.amount ? "unpaid" : "pending");

  const statusColors = {
    paid: { bg: [220, 252, 231], fg: [22, 163, 74] },
    unpaid: { bg: [254, 226, 226], fg: [220, 38, 38] },
    pending: { bg: [254, 243, 199], fg: [217, 119, 6] },
    cancelled: { bg: [229, 231, 235], fg: [75, 85, 99] },
  };

  const sc = statusColors[status.toLowerCase()] || statusColors.pending;

  // ===== HEADER =====
  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, W, 50, "F");

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("INVOICE", M, 28);

  // Generate invoice ID from available data
  let invId = "";
  if (inv._id) {
    invId = inv._id.slice(-6).toUpperCase();
  } else if (order._id) {
    invId = order._id.slice(-6).toUpperCase();
  } else if (inv.orderId?.orderId) {
    invId = inv.orderId.orderId.slice(-6).toUpperCase();
  } else {
    invId = Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Handle date formatting safely
  let date = new Date().toLocaleDateString("en-IN");
  let dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  dueDate = dueDate.toLocaleDateString("en-IN");

  if (inv.createdAt) {
    date = new Date(inv.createdAt).toLocaleDateString("en-IN");
    const due = new Date(inv.createdAt);
    due.setDate(due.getDate() + 30);
    dueDate = due.toLocaleDateString("en-IN");
  } else if (order.createdAt) {
    date = new Date(order.createdAt).toLocaleDateString("en-IN");
    const due = new Date(order.createdAt);
    due.setDate(due.getDate() + 30);
    dueDate = due.toLocaleDateString("en-IN");
  }

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${date}`, W - M, 20, { align: "right" });
  doc.text(`Due: ${dueDate}`, W - M, 26, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text(`Invoice #${invId}`, W - M, 34, { align: "right" });

  // Status badge
  doc.setFillColor(...sc.bg);
  doc.roundedRect(W - M - 25, 36, 25, 8, 2, 2, "F");

  doc.setFontSize(8);
  doc.setTextColor(...sc.fg);
  doc.text(status.toUpperCase(), W - M - 12.5, 41, {
    align: "center",
  });

  // ===== CARDS =====
  const top = 60;
  const cardW = (W - 2 * M - 6) / 2;

  box(M, top, cardW, 34, LIGHT_BG);

  doc.setFontSize(9);
  doc.setTextColor(...PURPLE);
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO", M + 4, top + 8);

  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  // Handle customer name from multiple possible fields
  const customerName =
    inv.customerName ||
    inv.billedTo ||
    order.customerName ||
    (order.machineName ? `Customer for ${order.machineName}` : "-");
  doc.text(customerName, M + 4, top + 16);

  doc.setFontSize(8);
  doc.setTextColor(...MUTED);

  // Handle machine name
  const machineName =
    order.machineName ||
    inv.machine ||
    (order.machine ? order.machine.name : "-");
  doc.text(`Machine: ${machineName}`, M + 4, top + 24);

  // Handle issue description
  let issueText =
    order.problemDescription || inv.issue || (order.issue ? order.issue : "-");
  if (issueText.length > 40) issueText = issueText.slice(0, 37) + "...";
  doc.text(`Issue: ${issueText}`, M + 4, top + 30);

  const cx = M + cardW + 6;

  box(cx, top, cardW, 34, LIGHT_BG);

  doc.setFontSize(9);
  doc.setTextColor(...PURPLE);
  doc.setFont("helvetica", "bold");
  doc.text("FROM", cx + 4, top + 8);

  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text("Nitin Machinery Services", cx + 4, top + 16);

  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Sinnar, Nashik, Maharashtra", cx + 4, top + 24);
  doc.text("+91 98501 30575", cx + 4, top + 30);

  // ===== TABLE =====
  const tableTop = top + 50;

  // INCREASED HEIGHT of blue header row from 10 to 14mm
  const headerHeight = 14;
  const rowHeight = 12; // Slightly increased row height as well

  // EXTENDED the purple stripe to the right edge
  doc.setFillColor(...PURPLE);
  doc.roundedRect(M, tableTop, W - M - 5, headerHeight, 2, 2, "F");

  const cols = ["Service", "Order ID", "Date", "Amount"];
  // Adjusted column positions to accommodate the wider stripe
  const colX = [M + 5, M + 85, M + 125, W - M - 8];

  // INCREASED font size for better visibility
  doc.setFontSize(10);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");

  cols.forEach((c, i) => {
    // Center text vertically in the taller header
    doc.text(
      c,
      colX[i],
      tableTop + headerHeight / 2 + 1.5,
      i === 3 ? { align: "right" } : {},
    );
  });

  // Data row with increased height - also extended to match
  doc.setFillColor(...LIGHT_BG);
  doc.rect(M, tableTop + headerHeight, W - M - 5, rowHeight, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...DARK);

  // Get order ID for display
  let displayOrderId = "#";
  if (order.orderId) {
    displayOrderId += order.orderId.slice(-6).toUpperCase();
  } else if (order._id) {
    displayOrderId += order._id.slice(-6).toUpperCase();
  } else {
    displayOrderId += "N/A";
  }

  // Get service name
  const serviceName =
    order.machineName ||
    inv.service ||
    (order.service ? order.service.name : "Service");

  // Get order date
  let orderDate = new Date().toLocaleDateString("en-IN");
  if (order.createdAt) {
    orderDate = new Date(order.createdAt).toLocaleDateString("en-IN");
  } else if (order.date) {
    orderDate = order.date;
  }

  // Get amount - handle number with or without currency symbol
  let amount = 0;
  if (typeof inv.amount === "number") {
    amount = inv.amount;
  } else if (typeof inv.amount === "string") {
    // Handle string like "1 45,000" -> 145000
    const cleaned = inv.amount.replace(/\s/g, "").replace(/,/g, "");
    amount = parseFloat(cleaned) || 0;
  } else if (inv.total) {
    amount =
      typeof inv.total === "number" ? inv.total : parseFloat(inv.total) || 0;
  } else if (order.amount) {
    amount =
      typeof order.amount === "number"
        ? order.amount
        : parseFloat(order.amount) || 0;
  }

  const row = [
    serviceName,
    displayOrderId,
    orderDate,
    `₹ ${amount.toLocaleString("en-IN")}`,
  ];

  // Center text vertically in the taller row
  row.forEach((r, i) => {
    doc.text(
      r,
      colX[i],
      tableTop + headerHeight + rowHeight / 2 + 1.5,
      i === 3 ? { align: "right" } : {},
    );
  });

  // ===== TOTAL =====
  const totalTop = tableTop + headerHeight + rowHeight + 15;

  doc.setDrawColor(...LINE);
  doc.line(M, totalTop, W - M, totalTop);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);

  // Moved "Total" label further left
  doc.text("Total", W - M - 60, totalTop + 10);

  doc.setTextColor(...PURPLE);
  doc.setFontSize(14);
  // Moved the amount further left as well
  doc.text(`₹ ${amount.toLocaleString("en-IN")}`, W - M - 10, totalTop + 10, {
    align: "right",
  });

  // ===== FOOTER =====
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "italic");

  doc.text("Thank you for your business!", W / 2, H - 20, {
    align: "center",
  });

  doc.setFillColor(...PURPLE);
  doc.rect(0, H - 10, W, 10, "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(7);

  doc.text(
    "Nitin Machinery Services • Nashik • +91 98501 30575",
    W / 2,
    H - 4,
    { align: "center" },
  );

  doc.save(`invoice_${invId}.pdf`);
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
      console.log("Fetched invoices:", data.data);
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
      if (data.success)
        setOrders(data.data.filter((o) => o.status === "completed"));
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async () => {
    if (!form.orderId || !form.customerName || !form.amount) {
      toast.error("All fields are required");
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
      setForm({ orderId: "", customerName: "", amount: "" });
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
    const headers = ["Invoice ID", "Customer", "Amount", "Date", "Status"];
    const rows = invoices.map((inv) => [
      inv._id,
      inv.customerName,
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
              fetchOrders();
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
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
