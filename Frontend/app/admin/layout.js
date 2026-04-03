"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Search, X, Menu } from 'lucide-react';
import { io } from 'socket.io-client';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">{children}</div>;
  }

  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);
  }, []);

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/service/unread", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchAllOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/service", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) setAllOrders(data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // On mount: load existing unread + all orders
  useEffect(() => {
    fetchNotifications();
    fetchAllOrders();
  }, []);

  // Socket.io — push new notifications in real time
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      fetchAllOrders(); // keep search list fresh
    });

    return () => socket.disconnect();
  }, []);

  const handleNotificationToggle = async () => {
    const opening = !isNotificationOpen;
    setIsNotificationOpen(opening);

    if (opening && notifications.some((n) => !n.isRead)) {
      const token = localStorage.getItem("token");
      try {
        await fetch("http://localhost:5000/api/service/mark-all-read", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Remove red dot immediately, keep items visible
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }

    if (!opening) {
      setNotifications([]); // clear only on close
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const results = allOrders.filter(
      (order) =>
        order.machineName?.toLowerCase().includes(q) ||
        order.customer?.name?.toLowerCase().includes(q) ||
        order.problemDescription?.toLowerCase().includes(q) ||
        order.status?.toLowerCase().includes(q)
    );
    setSearchResults(results.slice(0, 6));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3 w-full max-w-sm">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-zinc-600" />
            </button>

            <div ref={searchRef} className="relative w-full max-w-[280px]">
            <div
              className="flex items-center gap-3 text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 cursor-text hover:border-zinc-300 transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search orders, customers..."
                className="bg-transparent text-sm text-zinc-700 outline-none w-full placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchResults([]); }}>
                  <X className="h-4 w-4 text-zinc-400 hover:text-zinc-600" />
                </button>
              )}
            </div>

            {isSearchOpen && searchQuery && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  searchResults.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => {
                        router.push("/admin/orders");
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-start gap-3 p-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 last:border-0 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{order.machineName}</p>
                        <p className="text-xs text-zinc-500 truncate">
                          {order.customer?.name || "Unknown"} · {order.problemDescription}
                        </p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                        order.status === "pending"
                          ? "bg-orange-50 text-orange-700 ring-orange-600/20"
                          : order.status === "in-progress"
                            ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                            : "bg-green-50 text-green-700 ring-green-600/20"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-zinc-500">
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          </div>

          <div className="flex items-center gap-4">
            <div ref={notificationRef} className="relative">
              <button
                onClick={handleNotificationToggle}
                className="relative p-2 -mr-2 hover:bg-zinc-100 rounded-full transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5 text-zinc-500" />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="font-semibold text-zinc-900">Notifications</h3>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif._id} className="p-4 border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors">
                          <p className="text-sm font-medium text-zinc-900">
                            {notif.serviceRequest?.machineName}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                            {notif.serviceRequest?.problemDescription}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                              New Request
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {notif.user?.name || "Unknown"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                          <Bell className="h-5 w-5 text-zinc-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-900">All caught up!</p>
                        <p className="text-xs text-zinc-500 mt-1">No new service requests</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 text-center">
                      <a href="/admin/orders" className="text-xs font-medium text-brand-blue hover:text-blue-700 transition-colors hover:underline">
                        View all requests →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold select-none">
                {getInitials(adminName)}
              </div>
              <span className="text-sm font-medium text-zinc-700 hidden sm:block">{adminName}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}