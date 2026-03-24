"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ClipboardList,
  PenTool,
  Users,
  FileText,
  Mail,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Add Walk-in Order", href: "/admin/walkin-order", icon: PenTool },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Invoices", href: "/admin/invoices", icon: FileText },
    { name: "Promotional Emails", href: "/admin/promotions", icon: Mail },
  ];

  
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight text-brand-blue"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-white font-bold text-xs">
            NM
          </div>
          Nitin Machinery
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-brand-blue"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
