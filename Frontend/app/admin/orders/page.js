"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { Download, Eye } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // export orders to csv
  const exportToCSV = () => {
    if (!orders.length) {
      toast.error("No data to export");
      return;
    }

    // Convert data to CSV
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

    // Create downloadable file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  // 📥 Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/service", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data)

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

  // 🔄 Update status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/service/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {  // ✅ add this check
        toast.error("Failed to update status");
        return;
      }

      toast.success("Status updated ✅");
      fetchOrders();
    } catch {
      toast.error("Failed to update");
    }
  };

  // 🎨 Table columns
  const columns = [
    {
      header: "Customer",
      accessor: "customer",
      cell: (row) => row.customer?.name || "N/A",
    },
    {
      header: "Machine",
      accessor: "machineName",
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
        let color = "bg-gray-100";

        if (row.status === "completed") color = "bg-green-100";
        if (row.status === "in-progress") color = "bg-blue-100";
        if (row.status === "pending") color = "bg-yellow-100";

        return (
          <span className={`px-2 py-1 rounded ${color}`}>{row.status}</span>
        );
      },
    },
  ];

  // 🔘 Actions
  const actions = (row) => (
    <div className="flex gap-2">
      {row.status !== "completed" && (
        <Button onClick={() => updateStatus(row._id, "completed")} className="h-8 px-2">
          Complete
        </Button>
      )}
      {row.status !== "in-progress" && (
        <Button onClick={() => updateStatus(row._id, "in-progress")} className="h-8 px-2">
          In Progress
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Orders Management</h1>

        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {loading ? <div>Loading...</div> : <Table columns={columns} data={orders} actions={actions} />}
    </div>
  );
}
