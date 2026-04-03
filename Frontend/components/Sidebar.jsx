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
  X
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
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
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen && setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-zinc-200 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex justify-between items-center h-16 border-b border-zinc-200 px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight text-brand-blue"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-white font-bold text-xs ring-2 ring-brand-blue/20">
              NM
            </div>
            Nitin Machinery
          </Link>
          <button 
            className="lg:hidden text-zinc-500 hover:text-zinc-900"
            onClick={() => setIsOpen && setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen && setIsOpen(false)}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-100 hover:text-brand-blue hover:translate-x-1"
            >
              <item.icon className="h-5 w-5 transition-colors duration-300 group-hover:text-brand-blue" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-zinc-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:translate-x-1"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
