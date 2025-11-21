"use client";

import { useState } from "react";
import AdminSideBar from "@/components/layouts/dash/admin/Sidebar";
import Header from "@/components/layouts/dash/admin/Header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar - Always fixed, hidden on mobile when closed */}
      <AdminSideBar open={sidebarOpen} toggleOpen={toggleSidebar} />

      {/* Main Content Container */}
      <div className="flex flex-col lg:mr-72
       flex-1 w-full md:w-[calc(100%-18rem)] transition-all duration-300">
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
