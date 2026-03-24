"use client";

import DashboardCard from "@/components/DashboardCard";
import { Package, Clock, CheckCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProgress: 0,
    completed: 0,
    totalCustomers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/service/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("STATUS:", res.status);
        console.log("RESPONSE:", data);

        if (!res.ok) {
          toast.error(data.message || "Failed to load dashboard");
          return;
        }

        setStats(data);
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

      {/* 📊 Activity Section */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">
          Recent Activity Overview
        </h3>
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50">
          <p className="text-sm text-zinc-500">Activity chart coming soon 📊</p>
        </div>
      </div>
    </div>
  );
}
