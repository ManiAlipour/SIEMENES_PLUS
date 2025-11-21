"use client";

import Link from "next/link";
import { IoIosClose, IoIosSettings, IoIosStats } from "react-icons/io";
import {
  MdCategory,
  MdDashboardCustomize,
  MdOutlineMessage,
} from "react-icons/md";
import { IoCartSharp } from "react-icons/io5";
import { FcDocument } from "react-icons/fc";
import { usePathname } from "next/navigation";
import { FaUsersGear } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ISideBarProps {
  open: boolean;
  toggleOpen: () => void;
}

export default function AdminSideBar({ open, toggleOpen }: ISideBarProps) {
  const sidebarLinks = [
    {
      title: "داشبورد",
      href: "/admin",
      icon: MdDashboardCustomize,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "محصولات",
      href: "/admin/products",
      icon: IoCartSharp,
      color: "from-green-500 to-green-600",
    },
    {
      title: "دسته بندی ها",
      href: "/admin/categories",
      icon: MdCategory,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "بلاگ ها",
      href: "/admin/blogs",
      icon: FcDocument,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "کاربران",
      href: "/admin/users",
      icon: FaUsersGear,
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "کامنت ها",
      href: "/admin/comments",
      icon: MdOutlineMessage,
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "آمار سایت",
      href: "/admin/stats",
      icon: IoIosStats,
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleOpen}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0 right-0
          h-screen z-40
          w-72
          bg-gradient-to-b from-primary via-primary/95 to-primary/90
          backdrop-blur-xl shadow-2xl
          border-l border-white/10
          flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${open ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">پنل ادمین</h2>
                <p className="text-xs text-white/70">زیمنس پلاس</p>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IoIosClose className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {sidebarLinks.map((link, index) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => {
                    if (window.innerWidth < 768) toggleOpen();
                  }}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white/20 shadow-lg"
                      : "hover:bg-white/10 hover:translate-x-1"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${link.color} shadow-md ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    } transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Label */}
                  <span
                    className={`font-semibold ${
                      isActive ? "text-white" : "text-white/80"
                    }`}
                  >
                    {link.title}
                  </span>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
              <IoIosSettings className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white/80 group-hover:text-white transition-colors">
              تنظیمات
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
