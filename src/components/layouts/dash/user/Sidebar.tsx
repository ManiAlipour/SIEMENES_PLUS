"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Settings, User, LogOut, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Sidebar({
  open,
  onToggleSidebar,
}: {
  open?: boolean;
  onToggleSidebar?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: "/dashboard",
      label: "داشبورد",
      icon: Home,
      color: "from-blue-500 to-blue-600",
    },
    {
      href: "/dashboard/profile",
      label: "پروفایل",
      icon: User,
      color: "from-purple-500 to-purple-600",
    },
    {
      href: "/dashboard/settings",
      label: "تنظیمات",
      icon: Settings,
      color: "from-gray-500 to-gray-600",
    },
    {
      href: "/dashboard/likes",
      label: "محصولات موردعلاقه",
      icon: Heart,
      color: "from-pink-500 to-pink-600",
    },
  ];

  const handleLogout = () => {
    // TODO: Implement logout
    router.push("/");
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggleSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0 right-0
          h-screen z-50
          w-72
          bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          backdrop-blur-xl shadow-2xl
          border-l border-white/10
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">پنل کاربری</h2>
                <p className="text-xs text-white/70">زیمنس پلاس</p>
              </div>
            </div>
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2.5 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
              aria-label="بستن منو"
            >
              <span className="text-white text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onToggleSidebar?.();
                  }}
                  className={`group relative flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl transition-all duration-300 touch-manipulation ${
                    isActive
                      ? "bg-white/20 shadow-lg"
                      : "hover:bg-white/10 active:bg-white/15 hover:translate-x-1"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="userActiveIndicator"
                      className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${
                      item.color
                    } shadow-md ${
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
                    {item.label}
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl hover:bg-red-500/20 active:bg-red-500/30 transition-colors group touch-manipulation"
          >
            <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <span className="font-semibold text-red-400 group-hover:text-red-300 transition-colors">
              خروج از حساب
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
