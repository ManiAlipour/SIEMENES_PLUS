"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Bell, Search, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const [notifications] = useState(3);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <Link href="/" className="hidden md:flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/logo.jpg"
                alt="Siemens Plus Logo"
                width={40}
                height={40}
                priority
                className="rounded-xl shadow-md ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
              />
              <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg">پنل ادمین</span>
              <span className="text-xs text-gray-500">زیمنس پلاس</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-64"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {notifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {notifications}
              </motion.span>
            )}
          </motion.button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">
                مدیر سیستم
              </span>
              <span className="text-xs text-gray-500">
                admin@siemensplus.ir
              </span>
            </div>
            <div className="relative group">
              <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                <User className="w-5 h-5 text-white" />
              </button>
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-t-xl transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">پروفایل</span>
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-xl transition-colors w-full">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">خروج</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
