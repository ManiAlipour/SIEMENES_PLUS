"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiSettings,
  FiFileText,
  FiPackage,
  FiHeart,
  FiTrendingUp,
} from "react-icons/fi";

export default function UserDashboard() {
  const user = useSelector((state: RootState) => state.user);

  const infoCards = [
    {
      label: "نقش",
      value: user.role === "admin" ? "مدیر" : "کاربر عادی",
      icon: FiUser,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "وضعیت تأیید",
      value: user.verified ? "تأیید شده" : "در انتظار تأیید",
      icon: FiCheckCircle,
      color: user.verified
        ? "from-emerald-500 to-emerald-600"
        : "from-amber-500 to-amber-600",
      badge: user.verified ? "✅" : "🔸",
    },
    {
      label: "ایمیل",
      value: user.email || "تعریف نشده",
      icon: FiMail,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "تاریخ عضویت",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("fa-IR")
        : "تعریف نشده",
      icon: FiCalendar,
      color: "from-pink-500 to-pink-600",
    },
    {
      label: "آخرین ورود",
      value: "۱۴۰۴/۰۸/۱۵ – ۱۰:۳۲ ق.ظ",
      icon: FiClock,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "پشتیبانی",
      value: "آنلاین",
      icon: FiTrendingUp,
      color: "from-green-500 to-green-600",
      badge: "✅",
    },
  ];

  const actionCards = [
    {
      href: "/dashboard/profile",
      icon: FiUser,
      title: "پروفایل",
      description: "ویرایش اطلاعات شخصی و عکس کاربری",
      color: "from-blue-500 to-blue-600",
    },
    {
      href: "/dashboard/likes",
      icon: FiHeart,
      title: "محصولات موردعلاقه",
      description: "مشاهده و مدیریت محصولات موردعلاقه شما",
      color: "from-pink-500 to-pink-600",
    },
    {
      href: "/dashboard/settings",
      icon: FiSettings,
      title: "تنظیمات",
      description: "تنظیمات حساب کاربری و اعلان‌ها",
      color: "from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-3xl p-6 md:p-8 shadow-xl border border-primary/20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <FiUser className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  👋 سلام {user.name || "کاربر"}!
                </h1>
                <p className="text-white/90 text-sm md:text-base">
                  خوش آمدید به حساب کاربری خود در{" "}
                  <span className="font-semibold">زیمنس پلاس</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {infoCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl p-5 border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                    <p className="text-base font-bold text-gray-900 flex items-center gap-2">
                      {card.badge && <span>{card.badge}</span>}
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {actionCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
