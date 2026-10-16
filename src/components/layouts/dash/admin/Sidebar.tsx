"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, Boxes, ChartNoAxesCombined, Clapperboard, FileText,
  FolderTree, LayoutDashboard, Mail, MessageSquareText, Package,
  PanelRightClose, Star, Users, Wrench,
} from "lucide-react";

interface SidebarProps { open: boolean; toggleOpen: () => void }
const groups = [
  { label: "نمای کلی", items: [
    { title: "داشبورد", href: "/admin", icon: LayoutDashboard },
    { title: "آمار و گزارش‌ها", href: "/admin/stats", icon: ChartNoAxesCombined },
  ] },
  { label: "مدیریت محتوا", items: [
    { title: "محصولات", href: "/admin/products", icon: Package },
    { title: "دسته‌بندی‌ها", href: "/admin/categories", icon: FolderTree },
    { title: "تعمیرات", href: "/admin/repairs", icon: Wrench },
    { title: "مقاله‌ها", href: "/admin/blog", icon: FileText },
    { title: "ویدیوها", href: "/admin/blogs", icon: Clapperboard },
  ] },
  { label: "ارتباط با مشتریان", items: [
    { title: "کاربران", href: "/admin/users", icon: Users },
    { title: "دیدگاه‌ها", href: "/admin/comments", icon: MessageSquareText },
    { title: "امتیاز محصولات", href: "/admin/reviews", icon: Star },
    { title: "پیام‌های تماس", href: "/admin/contacts", icon: Mail },
  ] },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSideBar({ open, toggleOpen }: SidebarProps) {
  const pathname = usePathname();
  return <>
    <AnimatePresence>{open && <motion.button aria-label="بستن منو" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggleOpen} className="fixed inset-0 z-30 cursor-default bg-slate-950/50 backdrop-blur-sm md:hidden" />}</AnimatePresence>
    <aside className={`admin-sidebar fixed inset-y-0 right-0 z-40 flex w-[17rem] flex-col text-white transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
      <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="relative block h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-white/20"><Image src="/images/logo.jpg" alt="زیمنس پلاس" fill sizes="40px" className="object-cover" /></span>
          <span><span className="block text-sm font-extrabold tracking-tight">زیمنس پلاس</span><span className="mt-0.5 block text-[11px] text-blue-100/65">مرکز مدیریت</span></span>
        </Link>
        <button type="button" onClick={toggleOpen} aria-label="بستن منو" className="rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden"><PanelRightClose size={18} /></button>
      </div>
      <nav aria-label="منوی مدیریت" className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {groups.map((group) => <section key={group.label}>
          <h2 className="mb-2 px-3 text-[10px] font-bold tracking-wide text-blue-100/45">{group.label}</h2>
          <ul className="space-y-1">{group.items.map(({ title, href, icon: Icon }) => {
            const active = isActive(pathname, href);
            return <li key={href}><Link href={href} onClick={() => { if (window.innerWidth < 768) toggleOpen(); }} aria-current={active ? "page" : undefined} className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition ${active ? "bg-white/12 font-bold text-white shadow-sm" : "text-blue-100/70 hover:bg-white/[0.07] hover:text-white"}`}>
              {active && <span className="absolute inset-y-2 right-0 w-[3px] rounded-l-full bg-cyan-300" />}
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${active ? "bg-cyan-400/15 text-cyan-200" : "bg-white/[0.05] text-blue-100/60 group-hover:text-white"}`}><Icon size={16} strokeWidth={active ? 2.2 : 1.8} /></span>
              <span>{title}</span>
            </Link></li>;
          })}</ul>
        </section>)}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><div className="flex items-center gap-2 text-xs font-bold text-white/90"><Activity size={14} className="text-emerald-300" /> پنل مدیریت فعال است</div><p className="mt-1.5 text-[10px] leading-5 text-blue-100/50">مدیریت یکپارچه فروشگاه، محتوا و خدمات</p></div>
      </div>
    </aside>
  </>;
}
