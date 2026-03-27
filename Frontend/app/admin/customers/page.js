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

  // 📥 Fetch customers
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/service/customers", {
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
  ];

  // 🔘 Actions
  const actions = (row) => (
    <Button
      onClick={() => router.push(`/admin/customers/${encodeURIComponent(row.email)}`)}
      className="h-8 text-xs px-3"
    >
      <History className="mr-2 h-3 w-3" />
      Service History
    </Button>
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
