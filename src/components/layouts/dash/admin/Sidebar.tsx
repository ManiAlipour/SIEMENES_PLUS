"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Video,
  Newspaper,
  Users,
  MessagesSquare,
  ChartColumnIncreasing,
  Mail,
  Star,
  X,
} from "lucide-react";

interface ISideBarProps {
  open: boolean;
  toggleOpen: () => void;
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "نمای کلی",
    items: [
      { title: "داشبورد", href: "/admin", icon: LayoutDashboard },
      {
        title: "آمار و گزارش",
        href: "/admin/stats",
        icon: ChartColumnIncreasing,
      },
    ],
  },
  {
    label: "محتوا",
    items: [
      { title: "محصولات", href: "/admin/products", icon: Package },
      { title: "دسته‌بندی‌ها", href: "/admin/categories", icon: FolderTree },
      { title: "ویدیوها", href: "/admin/blogs", icon: Video },
      { title: "وبلاگ", href: "/admin/blog", icon: Newspaper },
    ],
  },
  {
    label: "تعاملات",
    items: [
      { title: "کاربران", href: "/admin/users", icon: Users },
      { title: "نظرات", href: "/admin/comments", icon: MessagesSquare },
      { title: "امتیازها", href: "/admin/reviews", icon: Star },
      { title: "پیام‌ها", href: "/admin/contacts", icon: Mail },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSideBar({ open, toggleOpen }: ISideBarProps) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleOpen}
            className="fixed inset-0 z-30 bg-[#0b1f33]/50 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          admin-sidebar fixed top-0 right-0 z-40 flex h-screen w-[17.5rem] flex-col
          transition-transform duration-300 ease-out
          md:translate-x-0
          ${open ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15">
              <Image
                src="/images/logo.jpg"
                alt="زیمنس پلاس"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">زیمنس پلاس</p>
              <p className="truncate text-[11px] text-white/55">پنل مدیریت</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={toggleOpen}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="بستن منو"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-white/40">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(pathname, item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 768) toggleOpen();
                        }}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                          active
                            ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                            : "text-white/65 hover:bg-white/6 hover:text-white"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="admin-nav-active"
                            className="absolute top-1/2 right-0 h-6 w-[3px] -translate-y-1/2 rounded-l-full bg-[#4db8ff]"
                          />
                        )}
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                            active
                              ? "bg-[#0079c2] text-white"
                              : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-[11px] leading-5 text-white/40">
            مدیریت محتوا، کاربران و آمار سایت زیمنس پلاس
          </p>
        </div>
      </aside>
    </>
  );
}
