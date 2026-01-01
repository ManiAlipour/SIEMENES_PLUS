"use client";

import { useState, useEffect } from "react";
import AdminChartSection from "@/components/layouts/dash/admin/AdminChartSection";
import RecentActionsWidget from "@/components/layouts/dash/admin/RecentActionsWidget";
import InfoCard from "@/components/ui/admin/InfoCard";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiMessageSquare,
  FiActivity,
} from "react-icons/fi";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    posts: 0,
    tickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data) {
          setStats({
            users: data.totalUsers || 0,
            products: data.totalProducts || 0,
            posts: data.totalPosts || 0,
            tickets: data.pendingTickets || 0,
          });
        }
      } catch (err) {
        console.error("خطا در دریافت آمار:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                داشبورد مدیریتی
              </h1>
              <p className="text-gray-600">
                خوش آمدید! اینجا می‌توانید تمام فعالیت‌های سایت را مدیریت کنید
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
              <FiActivity className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">
                سیستم آنلاین
              </span>
            </div>
          </div>
        </motion.header>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard
            title="کاربران"
            desc="کاربران فعال سیستم"
            count={stats.users}
            color="primary"
            trend={12}
            icon={<FiUsers className="w-6 h-6 text-white" />}
          />
          <InfoCard
            title="محصولات"
            desc="محصولات ثبت‌شده"
            count={stats.products}
            color="success"
            trend={8}
            icon={<FiPackage className="w-6 h-6 text-white" />}
          />
          <InfoCard
            title="پست‌ها"
            desc="در انتظار بررسی"
            count={stats.posts}
            color="warn"
            trend={-5}
            icon={<FiShoppingCart className="w-6 h-6 text-white" />}
          />
          <InfoCard
            title="تیکت‌ها"
            desc="در حال بررسی"
            count={stats.tickets}
            color="danger"
            trend={3}
            icon={<FiMessageSquare className="w-6 h-6 text-white" />}
          />
        </div>

        {/* Performance Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl bg-white border-2 border-gray-200 shadow-lg p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
            شاخص عملکرد کلی
          </h2>

          <div className="space-y-6">
            {/* Progress Item 1 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  نرخ تعامل کاربران
                </span>
                <span className="text-lg font-bold text-primary">۷۸٪</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-md"
                />
              </div>
            </div>

            {/* Progress Item 2 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  تکمیل سفارشات
                </span>
                <span className="text-lg font-bold text-amber-600">۶۳٪</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "63%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-md"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Recent Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <RecentActionsWidget />
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <AdminChartSection />
        </motion.div>
      </div>
    </div>
  );
}
