"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSearch, FiPhone, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile sidebar
  const [servicesOpen, setServicesOpen] = useState(false); // desktop mega
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // mobile submenu
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { name: "خانه", href: "/" },
    { name: "فروشگاه", href: "/shop" },
    { name: "محصولات", href: "/products" },
    { name: "وبلاگ", href: "/blog" },
    { name: "درباره ما", href: "/about-us" },
    { name: "تماس با ما", href: "/contact-us" },
  ];

  const services = [
    { name: "مشاوره و طراحی", href: "/services/consulting" },
    { name: "نصب و راه‌اندازی", href: "/services/installation" },
    { name: "تعمیرات و نگهداری", href: "/services/maintenance" },
    { name: "آموزش و کارگاه", href: "/services/training" },
  ];

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-[0.3rem]"
          : "bg-linear-to-b from-card to-background shadow-soft"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-[clamp(0.3rem,0.8vw,0.7rem)] flex flex-col gap-1.5">
        {/* Top row */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-full gap-[clamp(0.5rem,1vw,1.25rem)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="Siemens Plus Logo"
              width={40}
              height={40}
              className="rounded-full shadow-sm w-10 h-10"
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

          {/* Desktop navigation */}
          <nav className="hidden sm:flex items-center flex-wrap justify-center gap-[clamp(0.5rem,1.2vw,1.25rem)] font-vazir relative">
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
            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                onClick={() => setServicesOpen((v) => !v)}
                className="flex items-center gap-1 text-foreground hover:brightness-110 transition"
              >
                خدمات
                <FiChevronDown
                  className={`transition-transform ${
                    servicesOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-[min(80vw,720px)] bg-white text-black border border-borders shadow-2xl rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 z-50"
                  >
                    {services.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="group block rounded-lg p-3 hover:bg-background transition"
                      >
                        <div className="font-semibold text-foreground group-hover:text-primary">
                          {s.name}
                        </div>
                        <div className="text-xs text-[rgba(30,30,30,0.7)] mt-1">
                          جزئیات بیشتر
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Header actions */}
          <div className="hidden md:flex items-center shrink-0 gap-[clamp(0.4rem,1vw,0.75rem)] font-vazir">
            {token ? (
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-lg text-primary bg-white hover:brightness-110 transition border border-primary"
              >
                داشبورد
              </Link>
            ) : (
              <>
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
              </>
            )}
            <Link
              href="/shop"
              className="px-4 py-2 rounded-xl text-white bg-primary hover:brightness-110 transition shadow-soft"
            >
              فروشگاه
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setOpen(true)}
            className="sm:hidden text-foreground"
            aria-label="باز کردن منو"
          >
            <FiMenu size={26} />
          </button>
        </div>

        {/* Desktop search (spacing fixed) */}
        <div className="hidden md:flex items-center justify-between w-full gap-4">
          <div className="flex-1 max-w-md flex items-center gap-2">
            <input
              type="text"
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-borders focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
            />
            <button
              className="bg-primary text-white px-3 py-2 rounded-lg hover:brightness-110 transition-shadow shadow-sm"
              aria-label="جستجو"
            >
              <FiSearch />
            </button>
          </div>

          <div className="flex items-center gap-2 font-vazir text-sm text-[rgba(30,30,30,0.8)]">
            <FiPhone className="text-primary" />
            <span>09199883772</span>
          </div>
        </div>
      </div>

      {/* موبایل دراور */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              className="fixed bg-white inset-0 backdrop-blur-[1px] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed right-0 top-0 h-svh w-[82vw] max-w-[360px] bg-card border-l border-borders z-50 shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", duration: 0.35 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-borders">
                <span className="font-semibold">منو</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="بستن منو"
                  className="p-2 rounded-lg"
                >
                  <FiX size={22} />
                </button>
              </div>
              {/* موبایل دراور */}
              <AnimatePresence>
                {open && (
                  <>
                    {/* --- Overlay semi‑transparent --- */}
                    <motion.div
                      key="overlay"
                      className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setOpen(false)}
                    />

                    {/* --- Drawer --- */}
                    <motion.aside
                      key="drawer"
                      className="fixed top-0 right-0 h-svh w-[82vw] max-w-[370px] bg-white border-l border-gray-200 z-50 shadow-2xl flex flex-col justify-between"
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", duration: 0.4 }}
                    >
                      {/* --- Header --- */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <Link
                          href="/"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src="/images/logo.jpg"
                            alt="زیمنس پلاس"
                            width={34}
                            height={34}
                            className="rounded-full"
                          />
                          <span className="font-semibold text-lg text-gray-800">
                            زیمنس پلاس
                          </span>
                        </Link>
                        <button
                          onClick={() => setOpen(false)}
                          aria-label="بستن منو"
                          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                        >
                          <FiX size={22} />
                        </button>
                      </div>

                      {/* --- Search --- */}
                      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="جستجو..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-[15px]"
                        />
                        <button
                          className="p-2 rounded-lg bg-primary text-white hover:brightness-110 transition"
                          aria-label="جستجو"
                        >
                          <FiSearch size={20} />
                        </button>
                      </div>

                      {/* --- Links Section --- */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-vazir">
                        {links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-[15px] ${
                              pathname === link.href
                                ? "bg-teal-50 text-primary font-semibold"
                                : "text-gray-800 hover:bg-gray-50"
                            } transition`}
                          >
                            {link.name}
                          </Link>
                        ))}

                        {/* --- Services Submenu --- */}
                        <div className="border-t border-gray-100 pt-3">
                          <button
                            onClick={() => setMobileServicesOpen((v) => !v)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 transition"
                          >
                            <span className="text-[15px]">خدمات</span>
                            <FiChevronDown
                              className={`transition-transform ${
                                mobileServicesOpen ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {mobileServicesOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="pl-4 pt-1 flex flex-col space-y-1"
                              >
                                {services.map((s) => (
                                  <Link
                                    key={s.href}
                                    href={s.href}
                                    onClick={() => setOpen(false)}
                                    className="block px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-50 text-[14px]"
                                  >
                                    {s.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* --- Bottom Actions --- */}
                      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
                        {token ? (
                          <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="w-full text-center px-3 py-2 rounded-lg border border-primary text-primary hover:bg-teal-50 transition font-vazir"
                          >
                            داشبورد
                          </Link>
                        ) : (
                          <>
                            <Link
                              href="/login"
                              onClick={() => setOpen(false)}
                              className="w-full text-center px-3 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 transition font-vazir"
                            >
                              ورود
                            </Link>
                            <Link
                              href="/register"
                              onClick={() => setOpen(false)}
                              className="w-full text-center px-3 py-2 rounded-lg bg-primary text-white hover:brightness-110 transition font-vazir"
                            >
                              ثبت‌نام
                            </Link>
                          </>
                        )}
                        <Link
                          href="/shop"
                          onClick={() => setOpen(false)}
                          className="w-full text-center px-3 py-2 rounded-lg bg-primary text-white hover:brightness-110 transition font-vazir shadow-sm"
                        >
                          فروشگاه
                        </Link>
                      </div>
                    </motion.aside>
                  </>
                )}
              </AnimatePresence>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
