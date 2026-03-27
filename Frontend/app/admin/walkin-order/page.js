"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ correct
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

export default function WalkinOrder() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    email: "",
    machineName: "",
    problemDescription: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Unauthorized. Please login again.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create order");
        return;
      }

      toast.success("Walk-in order created successfully ✅");
      router.push("/admin/orders");

      // Reset form
      setFormData({
        customerName: "",
        contactNumber: "",
        email: "",
        address: "",
        machineName: "",
        problemDescription: "",
      });

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Server error");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Add Walk-in Order
        </h1>
        <p className="text-zinc-500 mt-1">
          Manually enter a service order for a walk-in customer.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
            <FormInput
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Phone number"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address (optional)"
            />
            <FormInput
              label="Machine Name / Model"
              name="machineName"
              value={formData.machineName}
              onChange={handleChange}
              placeholder="Equipment details"
              required
            />
          </div>

          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Customer address"
          />
          <FormInput
            label="Problem Description"
            name="problemDescription"
            type="textarea"
            value={formData.problemDescription}
            onChange={handleChange}
            placeholder="Detailed description of the issue"
            rows={4}
            required
          />

          <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
            <Button type="button" variant="outline" className="h-10 px-6">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="h-10 px-6 shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" /> Save Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
