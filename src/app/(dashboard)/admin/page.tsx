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
  FiMail,
  FiBarChart2,
  FiRefreshCw,
  FiFolder,
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
  totalCategories?: number;
}

function DashboardSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-36 rounded-2xl bg-white/70" />
      ))}
    </div>
  );
}

const quickLinks = [
  { href: "/admin/products", label: "محصولات", icon: FiPackage },
  { href: "/admin/categories", label: "دسته‌ها", icon: FiFolder },
  { href: "/admin/blog", label: "وبلاگ", icon: FiEdit3 },
  { href: "/admin/contacts", label: "پیام‌ها", icon: FiMail },
  { href: "/admin/stats", label: "آمار", icon: FiBarChart2 },
];

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
        totalCategories: statsData.totalCategories,
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

  const ticketAnswerRate = useMemo(() => {
    if (!stats?.totalTickets) return 0;
    const answered = stats.totalTickets - stats.pendingTickets;
    return Math.round((answered / stats.totalTickets) * 100);
  }, [stats]);

  const viewsTrend = stats ? parseFloat(stats.viewsGrowth) : 0;

  return (
    <div dir="rtl" className="mx-auto max-w-7xl">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1f33] md:text-3xl">
            داشبورد
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            خلاصه وضعیت محتوا، کاربران و تعاملات سایت
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="admin-btn-ghost"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            به‌روزرسانی
          </button>
          <Link href="/admin/stats" className="admin-btn">
            <FiBarChart2 size={16} />
            آمار کامل
          </Link>
        </div>
      </motion.header>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            title="کاربران"
            desc={`${stats?.activeUsers ?? 0} تأییدشده · ${stats?.newUsersThisMonth ?? 0} جدید`}
            count={stats?.users ?? 0}
            color="primary"
            icon={<FiUsers className="h-5 w-5" />}
          />
          <InfoCard
            title="محصولات"
            desc="محصولات ثبت‌شده در کاتالوگ"
            count={stats?.products ?? 0}
            color="success"
            icon={<FiPackage className="h-5 w-5" />}
          />
          <InfoCard
            title="وبلاگ"
            desc={`${stats?.posts ?? 0} ویدیو ثبت‌شده`}
            count={stats?.blogPosts ?? 0}
            color="warn"
            icon={<FiEdit3 className="h-5 w-5" />}
          />
          <InfoCard
            title="نظرات"
            desc={`${stats?.newCommentsThisMonth ?? 0} نظر این ماه`}
            count={stats?.comments ?? 0}
            color="danger"
            icon={<FiMessageSquare className="h-5 w-5" />}
          />
        </div>
      )}

      <div className="mb-7 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="admin-card p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-bold text-[#0b1f33]">
            شاخص‌های کلیدی
          </h2>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#f3f7fb] px-4 py-3 text-center">
              <p className="text-xs text-[#64748b]">بازدید امروز</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[#004c97]">
                {(stats?.pageViewsToday ?? 0).toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-xl bg-[#f3f7fb] px-4 py-3 text-center">
              <p className="text-xs text-[#64748b]">بازدید این ماه</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[#0079c2]">
                {(stats?.pageViewsThisMonth ?? 0).toLocaleString("fa-IR")}
              </p>
              {viewsTrend !== 0 && (
                <p
                  className={`mt-1 text-xs font-medium ${viewsTrend >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {viewsTrend >= 0 ? "+" : ""}
                  {viewsTrend.toLocaleString("fa-IR")}٪ نسبت به ماه قبل
                </p>
              )}
            </div>
            <div className="rounded-xl bg-[#f3f7fb] px-4 py-3 text-center">
              <p className="text-xs text-[#64748b]">پیام‌های در انتظار</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-rose-600">
                {(stats?.pendingTickets ?? 0).toLocaleString("fa-IR")}
              </p>
              {!!stats?.pendingTickets && (
                <Link
                  href="/admin/contacts"
                  className="mt-1 inline-block text-xs text-[#0079c2] hover:underline"
                >
                  مشاهده پیام‌ها
                </Link>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#475569]">
                نرخ پاسخ‌دهی پیام‌ها
              </span>
              <span className="text-sm font-bold text-amber-600">
                {ticketAnswerRate.toLocaleString("fa-IR")}٪
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#e8eef5]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ticketAnswerRate}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-l from-amber-500 to-amber-400"
              />
            </div>
          </div>
        </div>

        <div className="admin-card p-5">
          <h2 className="mb-4 text-base font-bold text-[#0b1f33]">
            دسترسی سریع
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#e8eef5] bg-[#f8fafc] px-3 py-4 text-sm font-medium text-[#334155] transition hover:border-[#0079c2]/30 hover:bg-white hover:text-[#004c97]"
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminChartSection />
        </div>
        <RecentActionsWidget />
      </div>
    </div>
  );
}
