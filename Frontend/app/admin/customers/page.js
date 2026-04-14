"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ ADD THIS
import Table from "@/components/Table";
import Button from "@/components/Button";
import { History, Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Toggle Active / Inactive
  const toggleCustomer = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this customer?",
    );
    if (!confirmDeactivate) return;
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/service/customer/toggle/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      // update UI instantly
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c)),
      );
    } catch {
      toast.error("Error updating customer");
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/service/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to load customers");
        return;
      }

      setCustomers(data.data);
      console.log("Fetched customers:", data.data);
    } catch {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 📊 Table columns
  const columns = [
    {
      header: "Customer Name",
      accessor: "name",
    },
    {
      header: "Contact",
      accessor: "contactNumber",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Address",
      accessor: "address",
    },
    {
      header: "Status",
      accessor: "isActive",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  // 🔘 Actions
  const actions = (row) => (
    <div className="flex gap-2">
      {/* Service History */}
      <Button
        onClick={() =>
          router.push(`/admin/customers/${encodeURIComponent(row.email)}`)
        }
        className="h-8 text-xs px-3"
      >
        <History className="mr-2 h-3 w-3" />
        History
      </Button>

      {/* 🔄 Activate / Deactivate */}
      <Button
        variant="outline"
        onClick={() => toggleCustomer(row._id)}
        className={`h-8 text-xs px-3 ${
          row.isActive
            ? "text-red-600 border-red-300 hover:bg-red-50"
            : "text-green-600 border-green-300 hover:bg-green-50"
        }`}
      >
        {row.isActive ? "Deactivate" : "Activate"}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Table columns={columns} data={customers} actions={actions} />
    </div>
  );
}
