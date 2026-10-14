"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, LogOut, Menu, UserRound } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin": "داشبورد",
  "/admin/stats": "آمار و گزارش‌ها",
  "/admin/products": "محصولات",
  "/admin/categories": "دسته‌بندی‌ها",
  "/admin/repairs": "مدیریت تعمیرات",
  "/admin/blog": "مقاله‌ها",
  "/admin/blogs": "ویدیوها",
  "/admin/users": "کاربران",
  "/admin/comments": "دیدگاه‌ها",
  "/admin/reviews": "امتیاز محصولات",
  "/admin/contacts": "پیام‌های تماس",
};

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const title = pageTitles[pathname] || "پنل مدیریت";

  useEffect(() => {
    let active = true;
    fetch("/api/users/get-one", { cache: "no-store" }).then((res) => res.json()).then((json) => {
      if (active && json?.success && json.data) setUser(json.data);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onToggleSidebar} aria-label="بازکردن منو" className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 md:hidden"><Menu size={18} /></button>
        <div className="min-w-0"><p className="truncate text-[11px] font-medium text-slate-400">زیمنس پلاس <span className="mx-1 text-slate-300">/</span> مدیریت</p><h1 className="mt-0.5 truncate text-base font-black text-slate-900 sm:text-lg">{title}</h1></div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link href="/" target="_blank" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-800"><ExternalLink size={15} /><span className="hidden sm:inline">مشاهده سایت</span></Link>
        <div className="relative" ref={menuRef}>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-2 pr-1 transition hover:bg-slate-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-cyan-600 text-white"><UserRound size={16} /></span>
            <span className="hidden max-w-32 text-right sm:block"><span className="block truncate text-xs font-bold text-slate-800">{user?.name || "مدیر سیستم"}</span><span className="block truncate text-[10px] text-slate-400">{user?.email || "حساب مدیر"}</span></span>
            <ChevronDown size={14} className={`text-slate-400 transition ${menuOpen ? "rotate-180" : ""}`} />
          </button>
          {menuOpen && <div className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
            <div className="border-b border-slate-100 px-3 py-2.5"><p className="truncate text-xs font-bold text-slate-800">{user?.name || "مدیر سیستم"}</p><p className="mt-1 truncate text-[10px] text-slate-400">{user?.email || ""}</p></div>
            <Link href="/" onClick={() => setMenuOpen(false)} className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50">بازگشت به فروشگاه</Link>
            <button type="button" disabled={loggingOut} onClick={() => void logout()} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"><LogOut size={15} />{loggingOut ? "در حال خروج…" : "خروج از حساب"}</button>
          </div>}
        </div>
      </div>
    </div>
  </header>;
}
