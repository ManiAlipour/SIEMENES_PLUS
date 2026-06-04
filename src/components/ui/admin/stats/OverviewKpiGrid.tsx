"use client";

import {
  FiEye,
  FiShoppingBag,
  FiSearch,
  FiActivity,
  FiUsers,
  FiMessageSquare,
  FiMail,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { formatFa } from "./StatsCharts";
import type { AdminAnalyticsData } from "./AnalyticsLists";

type Props = {
  analytics: AdminAnalyticsData;
};

type KpiItem = {
  label: string;
  value: number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  trend?: string;
};

function TrendBadge({ value }: { value?: string }) {
  if (!value || value === "0" || value === "0.0") return null;
  const num = parseFloat(value);
  const positive = num >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
        positive ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {positive ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
      {positive ? "+" : ""}
      {formatFa(Math.abs(num))}٪
    </span>
  );
}

export function OverviewKpiGrid({ analytics }: Props) {
  const { overview, trendStats } = analytics;

  const items: KpiItem[] = [
    {
      label: "کل بازدید صفحات",
      value: overview.totalViews,
      sub: `${formatFa(overview.pageViewsToday ?? 0)} امروز`,
      icon: <FiEye size={18} />,
      accent: "from-blue-500 to-blue-600",
      trend: trendStats.viewsGrowth,
    },
    {
      label: "بازدید محصولات",
      value: overview.totalProductViews,
      sub: `${formatFa(overview.productViewsThisMonth ?? 0)} این ماه`,
      icon: <FiShoppingBag size={18} />,
      accent: "from-emerald-500 to-emerald-600",
    },
    {
      label: "جستجوهای ثبت‌شده",
      value: overview.totalSearches,
      icon: <FiSearch size={18} />,
      accent: "from-violet-500 to-violet-600",
    },
    {
      label: "تعاملات کاربر",
      value: overview.totalInteractions,
      icon: <FiActivity size={18} />,
      accent: "from-amber-500 to-amber-600",
    },
    {
      label: "کاربران فعال (۲۴ ساعت)",
      value: overview.activeUsersDaily,
      sub: `${formatFa(overview.activeUsersMonthly)} در ۳۰ روز`,
      icon: <FiUsers size={18} />,
      accent: "from-cyan-500 to-cyan-600",
      trend: trendStats.activeUsersGrowth,
    },
    {
      label: "نظرات",
      value: overview.totalComments,
      sub: `${formatFa(overview.newCommentsThisMonth ?? 0)} این ماه`,
      icon: <FiMessageSquare size={18} />,
      accent: "from-teal-500 to-teal-600",
    },
    {
      label: "پیام‌های تماس",
      value: overview.totalContacts,
      sub: `${formatFa(overview.pendingContacts ?? 0)} در انتظار`,
      icon: <FiMail size={18} />,
      accent: "from-rose-500 to-rose-600",
    },
    {
      label: "کاربران ثبت‌نام‌شده",
      value: overview.totalUsers,
      sub: `${formatFa(overview.verifiedUsers ?? 0)} تأییدشده · ${formatFa(overview.newUsersThisMonth ?? 0)} جدید`,
      icon: <FiUsers size={18} />,
      accent: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-sm`}
            >
              {item.icon}
            </div>
            {item.trend && <TrendBadge value={item.trend} />}
          </div>
          <p className="mt-3 text-[11px] font-medium text-slate-500">{item.label}</p>
          <p className="mt-0.5 text-xl font-bold text-slate-900 tabular-nums">
            {formatFa(item.value)}
          </p>
          {item.sub && (
            <p className="mt-1 text-[10px] text-slate-400">{item.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
