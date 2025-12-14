"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Decorative Circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 py-6 sm:py-8">
        {/* Logo & Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group min-h-[44px] touch-manipulation"
            >
              <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base">بازگشت به صفحه اصلی</span>
            </Link>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Image
                src="/images/logo.jpg"
                alt="Siemens Plus Logo"
                width={80}
                height={80}
                className="rounded-2xl shadow-2xl ring-4 ring-white/20"
              />
              <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl" />
            </div>
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/20"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto" />
            <p className="text-gray-600 mt-4 text-sm sm:text-base">
              {title === "ورود"
                ? "به حساب کاربری خود وارد شوید"
                : "حساب کاربری جدید ایجاد کنید"}
            </p>
          </div>

          {children}
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 text-center"
        >
          {title === "ورود" ? (
            <p className="text-white/80 text-sm">
              حساب کاربری ندارید؟{" "}
              <Link
                href="/register"
                className="text-white font-semibold hover:underline min-h-[44px] inline-flex items-center touch-manipulation"
              >
                ثبت نام کنید
              </Link>
            </p>
          ) : (
            <p className="text-white/80 text-sm">
              قبلاً ثبت نام کرده‌اید؟{" "}
              <Link
                href="/login"
                className="text-white font-semibold hover:underline min-h-[44px] inline-flex items-center touch-manipulation"
              >
                وارد شوید
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
