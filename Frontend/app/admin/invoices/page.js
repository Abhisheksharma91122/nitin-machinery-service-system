"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { Download, FileText, X } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state for Generate Invoice
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    orderId: "",
    customerName: "",
    amount: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // 📥 Fetch invoices
  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/invoice", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Failed to load invoices"); return; }
      setInvoices(data.data);
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 📥 Fetch completed orders for dropdown
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/service", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        // Only show completed orders
        setOrders(data.data.filter((o) => o.status === "completed"));
      }
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 📤 Create Invoice
  const handleCreateInvoice = async () => {
    if (!form.orderId || !form.customerName || !form.amount) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/invoice", {
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
      if (!res.ok) { toast.error(data.message || "Failed to create invoice"); return; }

      toast.success("Invoice created ✅");
      setShowModal(false);
      setForm({ orderId: "", customerName: "", amount: "" });
      fetchInvoices(); // refresh
    } catch {
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  // 📊 Update invoice status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/invoice/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { toast.error("Failed to update status"); return; }
      toast.success("Status updated ✅");
      fetchInvoices();
    } catch {
      toast.error("Server error");
    }
  };

  // 📊 Export to CSV
  const exportToCSV = () => {
    if (!invoices.length) { toast.error("No data to export"); return; }

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

  // 📊 Columns
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
        <span className="font-semibold text-zinc-900">₹{row.amount}</span>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: "status",
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

  // 🔘 Actions
  const actions = (row) => (
    <div className="flex gap-2">
      {row.status !== "paid" && (
        <Button onClick={() => updateStatus(row._id, "paid")} className="h-8 px-2 text-xs">
          Mark Paid
        </Button>
      )}
      {row.status === "pending" && (
        <Button onClick={() => updateStatus(row._id, "unpaid")} className="h-8 px-2 text-xs">
          Mark Unpaid
        </Button>
      )}
      <Button onClick={exportToCSV} className="h-8 px-2">
        <Download className="h-3 w-3" />
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
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => {
              fetchOrders();
              setShowModal(true);
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading invoices...</div>
      ) : (
        <Table columns={columns} data={invoices} actions={actions} />
      )}

      {/* 🧾 Generate Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-bold text-zinc-900 mb-1">Generate Invoice</h2>
            <p className="text-sm text-zinc-500 mb-6">Create a new invoice for a completed order</p>

            <div className="flex flex-col gap-4">
              {/* Order Dropdown */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Select Order</label>
                <select
                  value={form.orderId}
                  onChange={(e) => {
                    const selected = orders.find((o) => o._id === e.target.value);
                    setForm({
                      orderId: e.target.value,
                      customerName: selected?.customer?.name || "",
                      amount: "",
                    });
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

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Amount (₹)</label>
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