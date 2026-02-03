"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft, FiSearch, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-cyan-600 via-primary to-cyan-600 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            {/* Decorative circles */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-xl"
            />
          </div>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-cyan-100">
              <FiAlertCircle className="w-16 h-16 text-cyan-600" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
        >
          صفحه مورد نظر یافت نشد
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 text-lg md:text-xl mb-8 max-w-md mx-auto leading-relaxed"
        >
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px] justify-center"
            >
              <FiHome className="w-5 h-5" />
              بازگشت به خانه
            </motion.button>
          </Link>

          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-cyan-600 rounded-xl font-bold text-base shadow-sm hover:shadow-md transition-all duration-300 min-w-[200px] justify-center"
            >
              <FiSearch className="w-5 h-5" />
              مشاهده محصولات
            </motion.button>
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-slate-200"
        >
          <p className="text-sm text-slate-500 mb-4">لینک‌های مفید:</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/"
              className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
            >
              خانه
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/shop"
              className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
            >
              فروشگاه
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/blog"
              className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
            >
              وبلاگ
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/about-us"
              className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
            >
              درباره ما
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/contact-us"
              className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
            >
              تماس با ما
            </Link>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            بازگشت به صفحه قبل
          </button>
        </motion.div>
      </div>
    </div>
  );
}
