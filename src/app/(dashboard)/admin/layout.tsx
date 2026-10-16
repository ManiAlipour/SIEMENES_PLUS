"use client";

import { useState } from "react";
import AdminSideBar from "@/components/layouts/dash/admin/Sidebar";
import Header from "@/components/layouts/dash/admin/Header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div dir="rtl" className="admin-shell flex min-h-screen">
      <AdminSideBar open={sidebarOpen} toggleOpen={toggleSidebar} />

      <div className="flex min-w-0 flex-1 flex-col md:mr-[17rem]">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="admin-main min-h-[calc(100vh-76px)] flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
