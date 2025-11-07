"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, User, LogOut, BarChart3, Folder } from "lucide-react";

import { IoMdClose } from "react-icons/io";

const navItems = [
  { href: "/dashboard", label: "داشبورد", icon: <Home size={18} /> },
  { href: "/dashboard/profile", label: "پروفایل", icon: <User size={18} /> },
  {
    href: "/dashboard/settings",
    label: "تنظیمات",
    icon: <Settings size={18} />,
  },
];

export default function Sidebar({
  open,
  onToggleSidebar,
}: {
  open?: boolean;
  onToggleSidebar?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed lg:static bg-[rgba(19,27,33,0.85)] backdrop-blur-md h-screen top-0 left-0 z-50 transition-all duration-300
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 border-r border-cyan-500/30`}
    >
      <div className="flex flex-col py-6 font-vazir text-[15px] text-gray-200">
        <div className="flex justify-between items-center">
          <span className="px-6 mb-5 text-lg font-bold text-cyan-400">
            منوی پنل
          </span>

          <button className="mb-5 lg:hidden" onClick={onToggleSidebar}>
            <IoMdClose size={20} />
          </button>
        </div>

        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-2.5 hover:bg-[rgba(0,255,255,0.15)] 
                hover:text-white rounded-md mb-1 transition-colors
                ${
                  isActive
                    ? "bg-[rgba(0,255,255,0.25)] text-white"
                    : "text-gray-300"
                }`}
            >
              <span className="text-cyan-400">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-auto px-6 pt-6 border-t border-cyan-500/20">
          <button className="flex items-center gap-2 text-red-400 hover:text-red-300">
            <LogOut size={18} />
            خروج
          </button>
        </div>
      </div>
    </aside>
  );
}
