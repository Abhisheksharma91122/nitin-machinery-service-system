"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Bell, Search } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Do not show sidebar on login page
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
          <div className="flex items-center gap-4 text-zinc-500">
            <Search className="h-5 w-5" />
            <span className="text-sm font-medium">Search...</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-zinc-500" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            <div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
