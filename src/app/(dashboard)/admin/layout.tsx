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
    <div className="flex min-h-screen bg-[#f9fafc]">
      {/* Sidebar (Glassmorphic fixed) */}
      <AdminSideBar open={sidebarOpen} toggleOpen={toggleSidebar} />

      {/* Main Content Container */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 overflow-x-hidden md:mr-52`}
      >
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 p-6 mt-[56px]">{children}</main>
      </div>
    </div>
  );
}
