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
    <div className="admin-shell flex min-h-screen">
      <AdminSideBar open={sidebarOpen} toggleOpen={toggleSidebar} />

      <div className="flex min-w-0 flex-1 flex-col md:mr-[17.5rem]">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="admin-main flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
