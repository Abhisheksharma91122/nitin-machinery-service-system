"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { Download, CheckCircle, Clock, PlayCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 📤 Export CSV
  const exportToCSV = () => {
    if (!orders.length) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Customer", "Machine", "Date", "Status"];

    const rows = orders.map((order) => [
      order.customer?.name,
      order.machineName,
      new Date(order.createdAt).toLocaleDateString(),
      order.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  // 📥 Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/service`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to load orders");
        return;
      }

      setOrders(data.data);
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔄 Update Status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/service/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      toast.success(`Marked as ${status} ✅`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Delete Order
  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service request?",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/service/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete");
        return;
      }

      toast.success("Service request deleted 🗑️");

      // remove instantly from UI
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      toast.error("Server error");
    }
  };

  // 📊 Table Columns
  const columns = [
    {
      header: "Customer",
      accessor: "customer",
      cell: (row) => (
        <div className="font-medium text-zinc-900">
          {row.customer?.name || "N/A"}
        </div>
      ),
    },
    {
      header: "Machine",
      accessor: "machineName",
      cell: (row) => <span className="text-zinc-600">{row.machineName}</span>,
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-zinc-500 text-sm">
          {new Date(row.createdAt).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => {
        const styles = {
          completed: "bg-green-50 text-green-700 ring-green-600/20",
          "in progress": "bg-blue-50 text-blue-700 ring-blue-600/20",
          pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
        };

        const icons = {
          completed: <CheckCircle className="w-3 h-3 mr-1" />,
          "in progress": <PlayCircle className="w-3 h-3 mr-1" />,
          pending: <Clock className="w-3 h-3 mr-1" />,
        };

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
              styles[row.status] || "bg-gray-50 text-gray-600 ring-gray-500/10"
            }`}
          >
            {icons[row.status]}
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
    },
  ];

  // 🔘 Actions (UPDATED)
  const actions = (row) => (
    <div className="flex items-center justify-end gap-2 w-[260px]">
      <Button
        variant="outline"
        onClick={() => updateStatus(row._id, "completed")}
        className={`h-8 px-3 text-xs ${
          row.status === "completed" ? "opacity-30 pointer-events-none" : ""
        }`}
        disabled={row.status === "completed"}
      >
        Complete
      </Button>

      <Button
        variant="secondary"
        onClick={() => updateStatus(row._id, "in progress")}
        className={`h-8 px-3 text-xs ${
          row.status === "in progress" ? "opacity-30 pointer-events-none" : ""
        }`}
        disabled={row.status === "in progress"}
      >
        In Progress
      </Button>

      {/* DELETE BUTTON */}
      <Button
        variant="outline"
        onClick={() => deleteOrder(row._id)}
        disabled={row.status === "completed"}
        className="text-red-600 border-red-300 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Orders Management
          </h1>
          <p className="text-sm text-zinc-500">
            View and update customer machinery service requests.
          </p>
        </div>

        <Button onClick={exportToCSV} variant="primary" className="shadow-sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-zinc-500">
            Loading orders...
          </div>
        ) : (
          <Table columns={columns} data={orders} actions={actions} />
        )}
      </div>
    </div>
  );
}
