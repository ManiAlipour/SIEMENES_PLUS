"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AdminChartSection from "@/components/layouts/dash/admin/AdminChartSection";
import RecentActionsWidget from "@/components/layouts/dash/admin/RecentActionsWidget";
import InfoCard from "@/components/ui/admin/InfoCard";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiPackage,
  FiEdit3,
  FiMessageSquare,
  FiActivity,
  FiMail,
  FiBarChart2,
  FiRefreshCw,
} from "react-icons/fi";

interface DashboardStats {
  users: number;
  activeUsers: number;
  products: number;
  blogPosts: number;
  posts: number;
  comments: number;
  pendingTickets: number;
  totalTickets: number;
  newUsersThisMonth: number;
  newCommentsThisMonth: number;
  pageViewsToday: number;
  pageViewsThisMonth: number;
  viewsGrowth: string;
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-36 rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);

      const [statsRes, analyticsRes] = await Promise.all([
        fetch("/api/admin/stats", { cache: "no-store" }),
        fetch("/api/admin/analytics", { cache: "no-store" }),
      ]);

      const statsData = await statsRes.json();
      const analyticsJson = await analyticsRes.json();
      const overview = analyticsJson?.data?.overview;
      const trendStats = analyticsJson?.data?.trendStats;

      setStats({
        users: statsData.totalUsers ?? 0,
        activeUsers: statsData.activeUsers ?? 0,
        products: statsData.totalProducts ?? 0,
        blogPosts: statsData.totalBlogPosts ?? 0,
        posts: statsData.totalPosts ?? 0,
        comments: statsData.totalComments ?? 0,
        pendingTickets: statsData.pendingTickets ?? 0,
        totalTickets: statsData.totalTickets ?? 0,
        newUsersThisMonth: statsData.newUsersThisMonth ?? 0,
        newCommentsThisMonth: statsData.newCommentsThisMonth ?? 0,
        pageViewsToday: overview?.pageViewsToday ?? 0,
        pageViewsThisMonth: overview?.pageViewsThisMonth ?? 0,
        viewsGrowth: trendStats?.viewsGrowth ?? "0",
      });
    } catch (err) {
      console.error("خطا در دریافت آمار:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const monthlyViewPercent = useMemo(() => {
    const MAX = 5000;
    const tv = stats?.pageViewsThisMonth ?? 0;
    return Math.min((tv / MAX) * 100, 100);
  }, [stats?.pageViewsThisMonth]);

  const ticketAnswerRate = useMemo(() => {
    if (!stats?.totalTickets) return 0;
    const answered = stats.totalTickets - stats.pendingTickets;
    return Math.round((answered / stats.totalTickets) * 100);
  }, [stats]);

  const viewsTrend = stats ? parseFloat(stats.viewsGrowth) : 0;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                داشبورد مدیریتی
              </h1>
              <p className="text-gray-600">
                خلاصه وضعیت سایت، محتوا و تعامل کاربران
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                <FiRefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                به‌روزرسانی
              </button>
              <Link
                href="/admin/stats"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 shadow-sm"
              >
                <FiBarChart2 size={16} />
                آمار کامل
              </Link>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
                <FiActivity className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">آنلاین</span>
              </div>
            </div>
          </div>
        </motion.header>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <InfoCard
              title="کاربران"
              desc={`${stats?.activeUsers ?? 0} تأییدشده · ${stats?.newUsersThisMonth ?? 0} جدید`}
              count={stats?.users ?? 0}
              color="primary"
              icon={<FiUsers className="w-6 h-6 text-white" />}
            />
            <InfoCard
              title="محصولات"
              desc="محصولات ثبت‌شده"
              count={stats?.products ?? 0}
              color="success"
              icon={<FiPackage className="w-6 h-6 text-white" />}
            />
            <InfoCard
              title="وبلاگ"
              desc={`${stats?.posts ?? 0} ویدیو / پست`}
              count={stats?.blogPosts ?? 0}
              color="warn"
              icon={<FiEdit3 className="w-6 h-6 text-white" />}
            />
            <InfoCard
              title="نظرات"
              desc={`${stats?.newCommentsThisMonth ?? 0} نظر این ماه`}
              count={stats?.comments ?? 0}
              color="danger"
              icon={<FiMessageSquare className="w-6 h-6 text-white" />}
            />
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl bg-white border-2 border-gray-200 shadow-lg p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
            شاخص‌های کلیدی
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">بازدید امروز</p>
              <p className="text-2xl font-bold text-cyan-600 tabular-nums">
                {(stats?.pageViewsToday ?? 0).toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">بازدید این ماه</p>
              <p className="text-2xl font-bold text-indigo-600 tabular-nums">
                {(stats?.pageViewsThisMonth ?? 0).toLocaleString("fa-IR")}
              </p>
              {viewsTrend !== 0 && (
                <p
                  className={`text-xs mt-1 font-medium ${viewsTrend >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {viewsTrend >= 0 ? "+" : ""}
                  {viewsTrend.toLocaleString("fa-IR")}٪ نسبت به ماه قبل
                </p>
              )}
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                <FiMail size={12} />
                پیام‌های در انتظار
              </p>
              <p className="text-2xl font-bold text-rose-600 tabular-nums">
                {(stats?.pendingTickets ?? 0).toLocaleString("fa-IR")}
              </p>
              {stats?.pendingTickets ? (
                <Link
                  href="/admin/contacts"
                  className="text-xs text-cyan-600 hover:underline mt-1 inline-block"
                >
                  مشاهده پیام‌ها
                </Link>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  پیشرفت بازدید ماهانه
                </span>
                <span className="text-lg font-bold text-primary">
                  {monthlyViewPercent.toFixed(0)}٪
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${monthlyViewPercent}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-md"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                بر اساس هدف ۵٬۰۰۰ بازدید ماهانه
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  نرخ پاسخ‌دهی پیام‌ها
                </span>
                <span className="text-lg font-bold text-amber-600">
                  {ticketAnswerRate}٪
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ticketAnswerRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-md"
                />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <RecentActionsWidget />
        </motion.div>

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
