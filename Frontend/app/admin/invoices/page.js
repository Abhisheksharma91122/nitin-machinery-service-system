"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { Download, FileText } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);

  // 📥 Fetch invoices
  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/invoice", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to load invoices");
        return;
      }

      setInvoices(data.data);
    } catch {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 📊 Columns
  const columns = [
    {
      header: "Invoice ID",
      accessor: "_id",
    },
    {
      header: "Customer",
      accessor: "customerName",
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => `₹${row.amount}`,
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

        if (row.status === "paid") color = "bg-green-100";
        if (row.status === "unpaid") color = "bg-red-100";
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
      <Button onClick={() => alert("View Invoice")}>
        <FileText className="h-4 w-4" />
      </Button>

      <Button onClick={() => alert("Download PDF")}>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>

        <Button onClick={() => alert("Create invoice flow")}>
          Generate New Invoice
        </Button>
      </div>

      <Table columns={columns} data={invoices} actions={actions} />
    </div>
  );
}