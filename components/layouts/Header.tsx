"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSearch, FiPhone } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "خانه", href: "/" },
    { name: "محصولات", href: "/products" },
    { name: "وبلاگ", href: "/blog" },
    { name: "درباره ما", href: "/about" },
    { name: "تماس با ما", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-linear-to-b from-card to-background shadow-soft"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-[clamp(0.5rem,1.4vw,1rem)] flex flex-col gap-2">
        {/* === خط بالا === */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-full gap-[clamp(0.5rem,1vw,1.25rem)]">
          {/* لوگو */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="Siemens Plus Logo"
              width={40}
              height={40}
              className="rounded-full shadow-sm"
            />
            <div className="flex flex-col leading-tight font-vazir">
              <span className="text-2xl font-extrabold text-foreground whitespace-nowrap">
                زیمِنس پلاس
              </span>
              <span className="text-xs text-[rgba(0,0,0,0.55)] whitespace-nowrap">
                فروش قطعات الکترونیکی صنعتی
              </span>
            </div>
          </Link>

          {/* ناوبری دسکتاپ */}
          <nav className="hidden sm:flex items-center flex-wrap justify-center gap-[clamp(0.5rem,1.2vw,1.25rem)] font-vazir">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition duration-200 hover:brightness-110 ${
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-foreground"
                } whitespace-nowrap`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* دکمه‌ها */}
          <div className="hidden md:flex items-center shrink-0 gap-[clamp(0.4rem,1vw,0.75rem)] font-vazir">
            <Link
              href="/login"
              className="px-3 py-2 rounded-lg text-foreground border border-borders hover:bg-background transition hover:brightness-105"
            >
              ورود
            </Link>
            <Link
              href="/register"
              className="px-3 py-2 rounded-lg text-white bg-primary hover:brightness-110 transition"
            >
              ثبت‌نام
            </Link>
            <Link
              href="/shop"
              className="px-4 py-2 rounded-xl text-white bg-primary hover:brightness-110 transition shadow-soft"
            >
              فروشگاه
            </Link>
          </div>

          {/* منوی موبایل */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden text-foreground"
          >
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* سرچ دسکتاپ */}
        <div className="hidden md:flex items-center justify-between w-full gap-4 mt-[clamp(0.25rem,1vw,0.75rem)]">
          <div className="flex-1 max-w-md flex items-center gap-2">
            <input
              type="text"
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-borders focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
            />
            <button className="bg-primary text-white px-3 py-2 rounded-lg hover:brightness-110 transition-shadow shadow-sm">
              <FiSearch />
            </button>
          </div>

          <div className="flex items-center gap-2 font-vazir text-sm text-[rgba(30,30,30,0.8)]">
            <FiPhone className="text-primary" />
            <span>۰۹۱۲۳۴۵۶۷۸۹</span>
          </div>
        </div>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden bg-card border-t border-borders shadow-soft"
          >
            <div className="flex items-center p-4 gap-2">
              <input
                type="text"
                placeholder="جستجو..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-borders focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
              <button className="bg-primary text-white px-3 py-2 rounded-lg hover:brightness-110 transition-shadow shadow-sm">
                <FiSearch />
              </button>
            </div>

            <nav className="flex flex-col p-4 gap-3 font-vazir">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-2 hover:text-primary transition ${
                    pathname === link.href
                      ? "text-primary font-semibold"
                      : "text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center gap-2 mt-3 text-[rgba(30,30,30,0.8)]">
                <FiPhone className="text-primary" />
                <span>۰۹۱۲۳۴۵۶۷۸۹</span>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-center border border-borders text-foreground hover:bg-background transition"
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-center text-white bg-primary hover:brightness-110 transition"
                >
                  ثبت‌نام
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 rounded-xl text-white bg-primary hover:brightness-110 transition shadow-soft text-center"
                >
                  فروشگاه
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
