"use client";

import { Menu } from "lucide-react";

interface TopNavBarProps {
  toggleSidebar: () => void;
}

export default function TopNavBar({ toggleSidebar }: TopNavBarProps) {
  return (
    <header
      className="fixed top-0 right-0 left-0 md:left-[224px] z-30 h-14 
                       bg-[#1a1f25]/50 backdrop-blur-md border-b border-slate-700/30 
                       flex items-center justify-between px-4"
    >
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded hover:bg-primary/20"
        onClick={toggleSidebar}
      >
        <Menu size={20} className="text-primary" />
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="جستجو..."
        className="hidden md:block rounded-lg px-4 py-[6px] w-64
                   border border-slate-600 bg-[#ffffff]/10 text-slate-100 
                   placeholder-slate-400 backdrop-blur-sm"
      />

      {/* Profile */}
      <div className="flex items-center gap-3">
        <img
          src="/images/admin-avatar.png"
          alt="Admin"
          className="w-8 h-8 rounded-full border border-slate-400"
        />
        <span className="text-slate-100 text-sm">مدیر سیستم</span>
      </div>
    </header>
  );
}
