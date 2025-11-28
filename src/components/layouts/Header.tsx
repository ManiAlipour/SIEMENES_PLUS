"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiShoppingBag,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { BsBagHeart } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import HeaderLikeBtn from "../features/HeaderLikeBtn";

export default function Header() {
  const pathname = usePathname();
  const { token } = useAuth();

  // State management
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false); // Desktop hover
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false); // Mobile click
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileOpen]);

  // Navigation Data
  const links = [
    { name: "خانه", href: "/" },
    { name: "فروشگاه", href: "/shop" },
    { name: "وبلاگ", href: "/blog" },
  ];

  const services = [
    {
      name: "اتوماسیون صنعتی",
      href: "/services/automation",
      desc: "PLC, HMI, SCADA",
    },
    {
      name: "درایو و موتور",
      href: "/services/drives",
      desc: "Sinamics, Simotics",
    },
    {
      name: "فشار ضعیف",
      href: "/services/low-voltage",
      desc: "Sirius, Sentron",
    },
    { name: "مشاوره فنی", href: "/services/consulting", desc: "طراحی و اجرا" },
  ];


  return (
    <>
      {/* --- Main Header --- */}
      <header
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-slate-200 py-3 shadow-sm"
            : "bg-white border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* 1. Logo Section */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg">
              <Image
                src="/images/logo.jpg"
                alt="Siemens Plus"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="hidden sm:flex flex-col font-vazir">
              <span className="text-xl font-bold text-slate-900 leading-none">
                زیمِنس <span className="text-cyan-600">پلاس</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider mt-1">
                INDUSTRIAL AUTOMATION
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation (Centered) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/50 p-1 rounded-full border border-slate-200/50 px-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-white text-cyan-700 shadow-sm border border-slate-100"
                    : "text-slate-600 hover:text-cyan-600 hover:bg-slate-100/50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Services Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isServicesOpen
                    ? "text-cyan-600 bg-slate-100/50"
                    : "text-slate-600 hover:text-cyan-600"
                }`}
              >
                خدمات
                <FiChevronDown
                  className={`transition-transform duration-300 ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Services Mega Menu */}
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 grid gap-1 overflow-hidden"
                  >
                    {/* Decorative gradient line at top */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />

                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="flex flex-col px-4 py-3 rounded-xl hover:bg-slate-50 transition group"
                      >
                        <span className="text-sm font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                          {service.name}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5">
                          {service.desc}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Right Actions (Search + Auth + Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compact Search Bar */}
            <div className="hidden md:flex items-center relative group">
              <FiSearch className="absolute right-3 text-slate-400 group-focus-within:text-cyan-500 transition-colors z-10" />
              <input
                type="text"
                placeholder="جستجوی قطعه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 focus:w-60 transition-[width] duration-300 bg-slate-100 border-transparent focus:bg-white border focus:border-cyan-200 rounded-full py-2 pr-9 pl-4 text-sm outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Likes Button */}
          <HeaderLikeBtn />

            {/* Login / Dashboard */}
            {token ? (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full text-sm font-medium transition shadow-sm shadow-cyan-200"
              >
                <FiUser />
                <span>داشبورد</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-medium transition"
              >
                ورود
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-800 bg-slate-100 rounded-lg active:scale-95 transition"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* --- Mobile Drawer (Fixed Logic) --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />

            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[85vw] max-w-[320px] h-screen bg-white z-[70] shadow-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-5 flex items-center justify-between border-b border-slate-100">
                <div className="font-bold text-lg text-slate-800">
                  منوی دسترسی
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full transition"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 space-y-6">
                {/* Mobile Search */}
                <div className="relative">
                  <FiSearch className="absolute right-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="جستجو در محصولات..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:border-cyan-500 outline-none transition"
                  />
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col space-y-1">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                        pathname === link.href
                          ? "bg-cyan-50 text-cyan-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* Mobile Services Dropdown */}
                  <div className="border-t border-slate-100 my-2 pt-2">
                    <button
                      onClick={() =>
                        setIsMobileServicesOpen(!isMobileServicesOpen)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                    >
                      <span>خدمات ما</span>
                      <FiChevronDown
                        className={`transition-transform ${
                          isMobileServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isMobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pr-4"
                        >
                          <div className="border-r-2 border-slate-100 pr-4 py-2 space-y-1">
                            {services.map((s) => (
                              <Link
                                key={s.href}
                                href={s.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="block py-2 text-sm text-slate-500 hover:text-cyan-600 transition"
                              >
                                {s.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="pt-6 border-t border-slate-100">
                  {!token ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/login"
                        className="flex justify-center py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
                      >
                        ورود
                      </Link>
                      <Link
                        href="/register"
                        className="flex justify-center py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium"
                      >
                        ثبت نام
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-600 text-white rounded-xl text-sm font-medium"
                    >
                      <FiUser /> ورود به داشبورد
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
