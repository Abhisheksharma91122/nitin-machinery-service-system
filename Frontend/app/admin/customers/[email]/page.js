"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CustomerHistory() {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email);
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 Fetch customer history
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/service/customer-history/${decodedEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to load history");
        return;
      }

      setOrders(data);
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchHistory();
  }, [email]);

  // 📊 Table columns
  const columns = [
    {
      header: "Machine",
      accessor: "machineName",
    },
    {
      header: "Problem",
      accessor: "problemDescription",
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* 🔙 Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer History</h1>
          <p className="text-zinc-500">{decodedEmail}</p>
        </div>

        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* 📋 Table */}
      {loading ? <p>Loading...</p> : <Table columns={columns} data={orders} />}
    </div>
  );
}
