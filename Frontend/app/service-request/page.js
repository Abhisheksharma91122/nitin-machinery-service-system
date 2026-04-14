"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { CheckCircle2 } from "lucide-react";

export default function ServiceRequest() {
  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    email: "",
    address: "",
    machineName: "",
    problemDescription: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const validate = () => {
    let newErrors = {};
    if (!formData.customerName)
      newErrors.customerName = "Customer Name is required";
    if (!/^\+?\d{10,13}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Invalid phone number";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.machineName)
      newErrors.machineName = "Machine Name is required";
    if (!formData.problemDescription)
      newErrors.problemDescription = "Problem Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Service request submitted successfully");
        setIsSubmitted(true);

        setFormData({
          customerName: "",
          contactNumber: "",
          email: "",
          address: "",
          machineName: "",
          problemDescription: "",
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Server error. Please try again");
    }finally {
    setLoading(false);
  }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 relative">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 w-full max-w-4xl mx-auto my-8">
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-8 sm:p-12 w-full">
          {isSubmitted ? (
            <div className="text-center py-16 flex flex-col items-center">
              <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">
                Request Submitted Successfully!
              </h2>
              <p className="text-zinc-600 max-w-lg mx-auto mb-8 text-lg">
                Thank you, {formData.customerName}. Your service request for{" "}
                {formData.machineName} has been received. Our team will contact
                you shortly.
              </p>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    customerName: "",
                    contactNumber: "",
                    email: "",
                    address: "",
                    machineName: "",
                    problemDescription: "",
                  });
                }}
                variant="outline"
                className="h-12 px-8"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                  Request Machine Service
                </h1>
                <p className="text-zinc-500 mt-2">
                  Fill out the details below to log a new service or repair
                  request.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Customer Name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    error={errors.customerName}
                    placeholder="Enter full name"
                  />
                  <FormInput
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    error={errors.contactNumber}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="john@example.com"
                  />
                  <FormInput
                    label="Machine Name"
                    name="machineName"
                    value={formData.machineName}
                    onChange={handleChange}
                    error={errors.machineName}
                    placeholder="e.g. CNC Lathe XT-100"
                  />
                </div>

                <FormInput
                  label="Address"
                  name="address"
                  type="textarea"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  placeholder="Enter complete site address"
                  rows={2}
                />

                <FormInput
                  label="Problem Description"
                  name="problemDescription"
                  type="textarea"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  error={errors.problemDescription}
                  placeholder="Describe the issue you're facing in detail..."
                  rows={4}
                />

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
