"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, User, LogOut, ExternalLink, ChevronDown } from "lucide-react";

type AdminUser = {
  name?: string;
  email?: string;
};

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/users/get-one", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json?.success && json.data) {
          setUser(json.data);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const displayName = user?.name || "مدیر سیستم";
  const displayEmail = user?.email || "";

  return (
    <header className="sticky top-0 z-20 border-b border-[#d7e3ef] bg-white/85 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-xl border border-[#d7e3ef] bg-white p-2 text-[#1e3a5f] transition hover:bg-[#f3f7fb] md:hidden"
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-[#0b1f33]">پنل مدیریت</p>
            <p className="text-xs text-[#64748b]">کنترل محتوا و عملکرد سایت</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#d7e3ef] bg-white px-3 py-2 text-xs font-medium text-[#1e3a5f] transition hover:border-[#0079c2]/40 hover:bg-[#f3f7fb]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">مشاهده سایت</span>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-[#d7e3ef] bg-white py-1.5 pr-1.5 pl-2.5 transition hover:bg-[#f3f7fb]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#004c97] to-[#0079c2] text-white">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden text-right sm:block">
                <span className="block text-xs font-semibold text-[#0b1f33]">
                  {displayName}
                </span>
                {displayEmail ? (
                  <span className="block max-w-[10rem] truncate text-[10px] text-[#64748b]">
                    {displayEmail}
                  </span>
                ) : null}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#64748b] transition ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-[#d7e3ef] bg-white shadow-[0_12px_40px_rgba(11,31,51,0.12)]">
                <div className="border-b border-[#eef3f8] px-3 py-2.5 sm:hidden">
                  <p className="text-xs font-semibold text-[#0b1f33]">
                    {displayName}
                  </p>
                  {displayEmail ? (
                    <p className="truncate text-[10px] text-[#64748b]">
                      {displayEmail}
                    </p>
                  ) : null}
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#334155] transition hover:bg-[#f3f7fb]"
                  onClick={() => setMenuOpen(false)}
                >
                  <Image
                    src="/images/logo.jpg"
                    alt=""
                    width={16}
                    height={16}
                    className="rounded"
                  />
                  بازگشت به فروشگاه
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "در حال خروج..." : "خروج از حساب"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
