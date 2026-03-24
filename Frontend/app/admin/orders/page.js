"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { Download, Eye } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  // 📥 Fetch orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/service", {
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
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔄 Update status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/service/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      toast.success("Status updated ✅");
      fetchOrders(); // refresh
    } catch {
      toast.error("Failed to update");
    }
  };

  // 🎨 Table columns
  const columns = [
    {
      header: "Customer",
      accessor: "customerName",
    },
    {
      header: "Machine",
      accessor: "machineName",
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (row) =>
        new Date(row.createdAt).toLocaleDateString(),
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
          <span className={`px-2 py-1 rounded ${color}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  // 🔘 Actions
  const actions = (row) => (
    <div className="flex gap-2">
      <Button
        onClick={() => updateStatus(row._id, "completed")}
        className="h-8 px-2"
      >
        Complete
      </Button>

      <Button
        onClick={() => updateStatus(row._id, "in-progress")}
        className="h-8 px-2"
      >
        In Progress
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Orders Management</h1>

        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Table columns={columns} data={orders} actions={actions} />
    </div>
  );
}