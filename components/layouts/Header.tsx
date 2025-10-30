"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSearch, FiPhone, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile sidebar
  const [servicesOpen, setServicesOpen] = useState(false); // desktop mega
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // mobile submenu
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // lock scroll when sidebar open
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { name: "خانه", href: "/" },
    { name: "محصولات", href: "/products" },
    // خدمات: handled separately for desktop
    { name: "وبلاگ", href: "/blog" },
    { name: "درباره ما", href: "/about" },
    { name: "تماس با ما", href: "/contact" },
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
            {/* خدمات - دسکتاپ */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                onClick={() => setServicesOpen((v) => !v)}
                className="flex items-center gap-1 text-foreground hover:brightness-110 transition"
                aria-haspopup="true"
                aria-expanded={servicesOpen}
              >
                خدمات{" "}
                <FiChevronDown
                  className={`${
                    servicesOpen ? "rotate-180" : "rotate-0"
                  } transition-transform`}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-[min(80vw,720px)] bg-white border border-borders shadow-2xl rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 z-50"
                    role="menu"
                  >
                    {services.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="group block rounded-lg p-3 hover:bg-background transition"
                      >
                        <div className="font-vazir-semibold text-foreground group-hover:text-primary">
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

          {/* دکمه منوی موبایل */}
          <button
            onClick={() => setOpen(true)}
            className="sm:hidden text-foreground"
            aria-label="باز کردن منو"
          >
            <FiMenu size={26} />
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
            <button
              className="bg-primary text-white px-3 py-2 rounded-lg hover:brightness-110 transition-shadow shadow-sm"
              aria-label="جستجو"
            >
              <FiSearch />
            </button>
          </div>

          <div className="flex items-center gap-2 font-vazir text-sm text-[rgba(30,30,30,0.8)]">
            <FiPhone className="text-primary" />
            <span>۰۹۱۲۳۴۵۶۷۸۹</span>
          </div>
        </div>
      </div>

      {/* اوورلی و سایدبار موبایل از راست */}
      <AnimatePresence>
        {open && (
          <>
            {/* overlay */}
            <motion.div
              key="overlay"
              className="fixed bg-white inset-0 backdrop-blur-[1px] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* drawer */}
            <motion.aside
              key="drawer"
              className="fixed right-0 top-0 h-svh w-[82vw] max-w-[360px] bg-card border-l border-borders z-50 shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", duration: 0.35 }}
              aria-label="نوار کناری منو"
            >
              <div className="flex items-center justify-between p-4 border-b border-borders">
                <span className="font-vazir-semibold">منو</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="بستن منو"
                  className="p-2 rounded-lg "
                >
                  <FiX size={22} />
                </button>
              </div>

              <div className="p-4 flex items-center gap-2 border-b border-borders">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-borders focus:outline-none 
                  focus:ring-2 focus:ring-primary bg-card text-foreground"
                />
                <button
                  className="bg-primary  px-3 py-2 rounded-lg hover:brightness-110 transition-shadow shadow-sm"
                  aria-label="جستجو"
                >
                  <FiSearch />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 font-vazir">
                {/* خدمات - موبایل با دراپ‌دان */}
                <div className="rounded-lg">
                  <button
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-2 py-3 rounded-lg hover:bg-background transition text-foreground"
                    aria-haspopup="true"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>خدمات</span>
                    <FiChevronDown
                      className={`${
                        mobileServicesOpen ? "rotate-180" : "rotate-0"
                      } transition-transform`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-2 pr-2"
                      >
                        <div className="mt-1 mb-2 rounded-lg border border-borders bg-card">
                          {services.map((s) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              onClick={() => setOpen(false)}
                              className={`block px-3 py-2 text-sm hover:bg-background transition ${
                                pathname === s.href
                                  ? "text-primary font-semibold"
                                  : "text-foreground"
                              }`}
                            >
                              {s.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* سایر لینک‌ها */}
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-2 py-3 rounded-lg hover:bg-background transition ${
                      pathname === link.href
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-borders my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg text-center border border-borders text-foreground hover:bg-background transition"
                  >
                    ورود
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg text-center text-white bg-primary hover:brightness-110 transition"
                  >
                    ثبت‌نام
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="col-span-2 px-4 py-2 rounded-xl text-white bg-primary hover:brightness-110 transition shadow-soft text-center"
                  >
                    فروشگاه
                  </Link>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[rgba(30,30,30,0.8)]">
                  <FiPhone className="text-primary" />
                  <span>۰۹۱۲۳۴۵۶۷۸۹</span>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
