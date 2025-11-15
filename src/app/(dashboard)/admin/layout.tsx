"use client";

import { useState } from "react";
import AdminSideBar from "@/components/layouts/dash/admin/Sidebar";
import TopNavBar from "@/components/layouts/dash/admin/TopNavbar";
import Header from "@/components/layouts/dash/admin/Header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#f9fafc]">
      {/* Sidebar */}
      <AdminSideBar open={sidebarOpen} toggleOpen={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:mr-52">
        {/* Top Nav */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 p-6 mt-[56px]">{children}</main>
      </div>
    </div>
  );
}
