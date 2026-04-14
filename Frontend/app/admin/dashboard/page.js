"use client";

import DashboardCard from "@/components/DashboardCard";
import { Package, Clock, CheckCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProgress: 0,
    completed: 0,
    totalCustomers: 0,
  });

  const [allRequests, setAllRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const [resStats, resReqs] = await Promise.all([
          fetch(`${API_URL}/service/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/service`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (resStats.status === 401 || resReqs.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/admin/login");
          return;
        }

        const statsData = await resStats.json();
        const reqsData = await resReqs.json();
        console.log(statsData, reqsData)

        if (!resReqs.ok) {
          toast.error(reqsData.message || "Failed to load requests");
          return;
        }

        setStats(statsData.data || statsData);
        if (reqsData.success) {
          setAllRequests(reqsData.data);
        }
      } catch (err) {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 🎯 Dynamic stats mapping
  const dashboardStats = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      description: "All service requests",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      description: "Requires attention",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: CheckCircle,
      description: "Currently being serviced",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      description: "Unique customers",
    },
  ];

  // 📈 Prepare data for charts
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const count = allRequests.filter(req => {
      if (!req.createdAt) return false;
      try {
        return isSameDay(parseISO(req.createdAt), date);
      } catch {
        return false;
      }
    }).length;
    return { name: format(date, 'MMM dd'), requests: count };
  });

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981']; // pending, in progress, completed
  const pieData = [
    { name: 'Pending', value: stats.pendingOrders },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Completed', value: stats.completed },
  ].filter(item => item.value > 0);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="text-zinc-500 mt-1">
          Overview of service management system.
        </p>
      </div>

      {/* 🔄 Loading State */}
      {loading ? (
        <div className="text-center py-10">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat, i) => (
            <DashboardCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          ))}
        </div>
      )}

      {/* 📊 Activity & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Requests Over Last 7 Days</h3>
          <div className="min-h-[300px] w-full" style={{ minHeight: 0, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={last7DaysData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Service Status Breakdown</h3>
          <div className="min-h-[300px] w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-zinc-500">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* 📋 Recent Orders List with Filters */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-semibold text-zinc-900">Recent Service Requests</h3>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600 min-w-[650px]">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-900 w-32">Date</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Customer</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Machine</th>
                <th className="px-4 py-3 font-semibold text-zinc-900 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {allRequests
                .filter(req => filterStatus === "All" || req.status === filterStatus)
                .sort((a, b) => {
                  const d1 = new Date(a.createdAt).getTime();
                  const d2 = new Date(b.createdAt).getTime();
                  return sortOrder === "Newest" ? d2 - d1 : d1 - d2;
                })
                .slice(0, 10)
                .map(req => (
                  <tr key={req._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-700">{format(new Date(req.createdAt || new Date()), 'MMM dd, yyyy')}</td>
                    <td className="px-4 py-3 text-zinc-900 font-medium">{req.customer?.name || "N/A"}</td>
                    <td className="px-4 py-3">{req.machineName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-inset ${req.status === 'pending' ? 'bg-orange-50 text-orange-700 ring-orange-600/20' :
                        req.status === 'in progress' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                          'bg-green-50 text-green-700 ring-green-600/20'
                        }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              {allRequests.filter(req => filterStatus === "All" || req.status === filterStatus).length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-zinc-500 bg-zinc-50/50 rounded-b-lg">
                    No service requests found matching your filters.
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
