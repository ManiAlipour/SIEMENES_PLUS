"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX, FiSearch, FiPhone } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const links = [
    { name: "خانه", href: "/" },
    { name: "محصولات", href: "/products" },
    { name: "وبلاگ", href: "/blog" },
    { name: "درباره ما", href: "/about" },
    { name: "تماس با ما", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-gradient-to-b from-white to-[#f7f7f7] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-[clamp(0.5rem,1.4vw,1rem)] flex flex-col gap-2">
        {/* --- Top Row --- */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-full gap-[clamp(0.5rem,1vw,1.25rem)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="Siemens Plus Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col leading-tight font-vazir">
              <span className="text-2xl font-extrabold text-gray-900 whitespace-nowrap">
                زیمِنس پلاس
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                فروش قطعات الکترونیکی صنعتی
              </span>
            </div>
          </Link>

          {/* Nav Links (hide earlier than md) */}
          <nav className="hidden sm:flex items-center flex-wrap justify-center gap-[clamp(0.5rem,1.2vw,1.25rem)] font-vazir">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-transform duration-200 hover:scale-105 hover:text-primary ${
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-gray-800"
                } whitespace-nowrap`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="hidden md:flex items-center flex-shrink-0 gap-[clamp(0.4rem,1vw,0.75rem)]">
            <Link
              href="/login"
              className="px-3 py-2 rounded-lg font-vazir text-gray-800 border border-gray-300 hover:bg-gray-100 transition transform hover:scale-105"
            >
              ورود
            </Link>
            <Link
              href="/register"
              className="px-3 py-2 rounded-lg font-vazir text-white bg-primary hover:bg-primary/90 transition transform hover:scale-105"
            >
              ثبت‌نام
            </Link>
            <Link
              href="/shop"
              className="px-4 py-2 rounded-xl font-vazir text-white bg-primary hover:bg-primary/90 transition shadow-md transform hover:scale-105"
            >
              فروشگاه
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden text-gray-900 ml-auto"
          >
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* --- Lower Row Desktop --- */}
        <div className="hidden md:flex items-center justify-between w-full gap-4 mt-[clamp(0.25rem,1vw,0.75rem)]">
          <div className="flex-1 max-w-md flex items-center gap-2">
            <input
              type="text"
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-shadow shadow-sm">
              <FiSearch />
            </button>
          </div>

          <div className="flex items-center gap-2 font-vazir text-sm text-gray-600">
            <FiPhone />
            <span>۰۹۱۲۳۴۵۶۷۸۹</span>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Animated --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden bg-white border-t border-gray-200 shadow-md"
          >
            <div className="flex items-center p-4 gap-2">
              <input
                type="text"
                placeholder="جستجو..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-shadow shadow-sm">
                <FiSearch />
              </button>
            </div>

            <nav className="flex flex-col p-4 gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-2 font-vazir hover:text-primary transition ${
                    pathname === link.href
                      ? "text-primary font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <FiPhone />
                <span>۰۹۱۲۳۴۵۶۷۸۹</span>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-center font-vazir text-gray-800 border border-gray-300 hover:bg-gray-100 transition"
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-center font-vazir text-white bg-primary hover:bg-primary/90 transition"
                >
                  ثبت‌نام
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 rounded-xl font-vazir text-white bg-primary hover:bg-primary/90 transition shadow-md text-center"
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
