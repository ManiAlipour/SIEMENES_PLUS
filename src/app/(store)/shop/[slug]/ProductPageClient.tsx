"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LikeButton from "./LikeButton";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaPhoneAlt,
  FaArrowRight,
  FaShareAlt,
  FaStar,
  FaShieldAlt,
  FaBox,
} from "react-icons/fa";
import { FiChevronRight, FiCpu, FiLayers, FiMaximize } from "react-icons/fi";

// --- Types ---
type ProductObject = {
  _id: string;
  name: string;
  modelNumber: string;
  brand: string;
  category: string;
  image: string;
  description: string;
  specifications: Record<string, string>;
};

type Product = ProductObject & {
  similarProducts: ProductObject[];
};

interface ProductPageClientProps {
  product: Product;
}

const OFFICE_PHONE = "021-12345678";
const TELEGRAM_LINK = "https://t.me/yourstore";
const WHATSAPP_LINK = "https://wa.me/989123456789";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function ProductPageClient({ product }: ProductPageClientProps) {
  return (
    <div
      className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-black selection:text-white"
      dir="rtl"
    >
      {/* === MOBILE HEADER (Floating & Glass) === */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:hidden pointer-events-none">
        <Link
          href="/shop"
          className="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-gray-700 active:scale-90 transition-transform"
        >
          <FaArrowRight />
        </Link>
        <div className="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-gray-700 active:scale-90 transition-transform">
          {/* Suspense for Like Button inside header for Mobile */}
          <Suspense>
            <LikeButton productId={product._id} productName={product.name} />
          </Suspense>
        </div>
      </header>

      <main className="container mx-auto px-0 md:px-6 py-0 md:py-10 max-w-7xl">
        {/* === DESKTOP BREADCRUMB === */}
        <nav className="hidden md:flex items-center gap-3 text-sm text-gray-400 mb-6 px-2">
          <Link href="/" className="hover:text-black transition-colors">
            خانه
          </Link>
          <FiChevronRight />
          <Link href="/shop" className="hover:text-black transition-colors">
            محصولات
          </Link>
          <FiChevronRight />
          <span className="text-black font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-start">
          {/* === LEFT COL: VISUALS (Hero Image) === */}
          {/* Mobile: Full bleed top image. Desktop: Rounded card */}
          <div className="relative lg:sticky lg:top-24 w-full h-[50vh] lg:h-auto lg:aspect-square bg-[#F3F4F6] lg:rounded-[2.5rem] overflow-hidden flex items-center justify-center group">
            {/* Soft ambient glow behind product */}
            <div className="absolute w-3/4 h-3/4 bg-white rounded-full blur-3xl opacity-60"></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 w-3/4 h-3/4"
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <FaBox size={80} />
                </div>
              )}
            </motion.div>

            {/* Desktop Like Button (Floating) */}
            <div className="hidden lg:block absolute top-8 right-8 z-20">
              <div className="bg-white p-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                <Suspense>
                  <LikeButton
                    productId={product._id}
                    productName={product.name}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {/* === RIGHT COL: DETAILS (The Sheet) === */}
          {/* Mobile: Negative margin to overlap image like a sheet */}
          <div className="relative z-10 -mt-12 lg:mt-0 bg-white lg:bg-transparent rounded-t-[2.5rem] lg:rounded-none px-6 py-8 lg:p-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-none min-h-[50vh]">
            {/* Mobile Pull Indicator */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 lg:hidden"></div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex flex-col gap-6"
            >
              {/* Tags */}
              <div className="flex gap-2">
                {product.brand && (
                  <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    {product.brand}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
                  {product.category || "محصول"}
                </span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-400 text-sm font-mono">
                  Model: {product.modelNumber || product._id.slice(-6)}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 w-full"></div>

              {/* Description */}
              <div className="prose prose-gray prose-sm text-gray-500 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Specs Grid (Modern Chips) */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiCpu /> مشخصات کلیدی
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(product.specifications)
                        .slice(0, 6)
                        .map(([key, value], idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-1 hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-gray-400 text-xs">{key}</span>
                            <span className="text-gray-800 text-sm font-bold">
                              {value}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Trust Badges */}
              <div className="flex items-center gap-6 py-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 min-w-max text-gray-500 text-sm">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <FaShieldAlt />
                  </div>
                  <span>گارانتی اصالت</span>
                </div>
                <div className="flex items-center gap-2 min-w-max text-gray-500 text-sm">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                    <FaStar />
                  </div>
                  <span>تضمین کیفیت</span>
                </div>
              </div>

              {/* Desktop Action Area (Hidden on Mobile) */}
              <div className="hidden lg:flex flex-col gap-4 mt-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 font-medium">قیمت محصول:</span>
                  <span className="text-xl font-bold text-gray-900">
                    تماس بگیرید
                  </span>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`tel:${OFFICE_PHONE}`}
                    className="flex-1 bg-black text-white h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <FaPhoneAlt className="animate-pulse" />
                    <span>مشاوره و خرید</span>
                  </a>
                  <a
                    href={WHATSAPP_LINK}
                    className="w-14 h-14 bg-white border border-gray-200 text-[#25D366] rounded-2xl flex items-center justify-center text-2xl hover:bg-gray-50 transition-colors"
                  >
                    <FaWhatsapp />
                  </a>
                  <a
                    href={TELEGRAM_LINK}
                    className="w-14 h-14 bg-white border border-gray-200 text-[#229ED9] rounded-2xl flex items-center justify-center text-2xl hover:bg-gray-50 transition-colors"
                  >
                    <FaTelegramPlane />
                  </a>
                </div>
              </div>

              {/* Spacer for mobile bottom bar */}
              <div className="h-24 lg:hidden"></div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* === MOBILE BOTTOM DOCK (iOS Style) === */}
      <div className="fixed bottom-0 left-0 right-0 p-4 lg:hidden z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="bg-black/90 backdrop-blur-xl text-white p-2 rounded-[1.5rem] shadow-2xl flex items-center gap-2 pl-3">
          <div className="flex-1 flex flex-col justify-center px-2">
            <span className="text-[10px] text-gray-400">
              نیاز به مشاوره دارید؟
            </span>
            <span className="text-sm font-bold text-white">
              تماس با کارشناس
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${OFFICE_PHONE}`}
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-lg shadow-lg active:scale-90 transition-transform"
            >
              <FaPhoneAlt />
            </a>
            <a
              href={WHATSAPP_LINK}
              className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center text-xl shadow-lg active:scale-90 transition-transform"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
