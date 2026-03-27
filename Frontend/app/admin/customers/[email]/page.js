"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import Button from "@/components/Button";

export default function CustomerDetails() {
  const { email } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedEmail = decodeURIComponent(email);

        // Fetch both in parallel
        const [resHistory, resCustomers] = await Promise.all([
          fetch(`http://localhost:5000/api/service/customer-history/${email}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/service/customers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dataHistory = await resHistory.json();
        const dataCustomers = await resCustomers.json();

        if (!resHistory.ok) {
          toast.error(dataHistory.message || "Failed to load history");
          return;
        }

        // Find customer by email from customers list
        if (dataCustomers.success) {
          const found = dataCustomers.data.find(c => c.email === decodedEmail);
          if (found) {
            setCustomer({
              name: found.name,
              email: found.email,
              contact: found.contactNumber,  // ✅ correct field name
              address: found.address,
            });
          } else {
            setCustomer({ email: decodedEmail, name: "Unknown Customer" });
          }
        }

        // Set requests
        if (dataHistory.success) {
          setRequests(dataHistory.data);  // ✅ data is under .data
        } else {
          setRequests([]);
        }

      } catch (err) {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchCustomerData();
  }, [email]);

  // 📊 Last 7 days chart
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);

    const count = requests.filter((req) => {
      if (!req.createdAt) return false;
      try {
        return isSameDay(parseISO(req.createdAt), date);
      } catch {
        return false;
      }
    }).length;

    return {
      name: format(date, "MMM dd"),
      requests: count,
    };
  });

  // 🥧 Status breakdown
  const COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

  const pieData = [
    {
      name: "Pending",
      value: requests.filter((r) => r.status === "pending").length,
    },
    {
      name: "In Progress",
      value: requests.filter((r) => r.status === "in-progress").length,
    },
    {
      name: "Completed",
      value: requests.filter((r) => r.status === "completed").length,
    },
  ].filter((item) => item.value > 0);

  // 🔍 Filter + Sort
  const filteredRequests = requests
    .filter(
      (req) => filterStatus === "All" || req.status === filterStatus
    )
    .sort((a, b) => {
      const d1 = new Date(a.createdAt).getTime();
      const d2 = new Date(b.createdAt).getTime();
      return sortOrder === "Newest" ? d2 - d1 : d1 - d2;
    });

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">

      {/* 🔙 Back */}
      <div className="flex items-center gap-4 border-b border-zinc-200 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Customer Details</h1>
          <p className="text-sm text-zinc-500">History and statistics for this customer</p>
        </div>
      </div>

      {/* 👤 Customer Info & High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm md:col-span-2 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue text-2xl font-bold uppercase shrink-0">
              {customer?.name?.charAt(0) || '?'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">{customer?.name}</h2>
              <div className="mt-2 text-sm text-zinc-600 space-y-1">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {customer?.email}
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {customer?.contact}
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {customer?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="text-4xl font-extrabold text-brand-blue">{requests.length}</div>
          <p className="text-sm font-medium text-zinc-500 mt-1">Total Requests</p>
          <div className="w-full h-px bg-zinc-100 my-4"></div>
          <div className="flex w-full justify-between text-xs font-medium">
            <div className="text-orange-600">{requests.filter(r => r.status === 'pending').length} Pending</div>
            <div className="text-green-600">{requests.filter(r => r.status === 'completed').length} Completed</div>
          </div>
        </div>
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 📈 Requests */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-semibold text-zinc-900 mb-4">Requests (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="requests" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🥧 Status */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-semibold text-zinc-900 mb-4">Status Breakdown</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={80}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-zinc-500 text-center mt-20">
                No data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 📋 Requests Table Section */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="font-semibold text-zinc-900 text-lg">Service Requests</h3>

          {/* 🔍 Filters */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-900 w-32">Date</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Machine</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Problem</th>
                <th className="px-4 py-3 font-semibold text-zinc-900 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-700">
                    {format(new Date(req.createdAt || new Date()), "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{req.machineName}</td>
                  <td className="px-4 py-3 max-w-xs truncate" title={req.problemDescription}>
                    {req.problemDescription}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-inset ${req.status === "pending"
                          ? "bg-orange-50 text-orange-700 ring-orange-600/20"
                          : req.status === "in-progress"
                            ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                            : "bg-green-50 text-green-700 ring-green-600/20"
                        }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-zinc-500 bg-zinc-50/50 rounded-b-lg"
                  >
                    No requests found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}