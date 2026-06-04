"use client";

import { MonthlyView, formatFa } from "./StatsCharts";
import type { AdminAnalyticsData } from "./AnalyticsLists";

type Props = {
  data: MonthlyView[];
  analytics?: AdminAnalyticsData | null;
};

export function SummaryStatsCards({ data, analytics }: Props) {
  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  const averageViews = data.length ? Math.round(totalViews / data.length) : 0;
  const thisMonth = data[data.length - 1]?.views ?? 0;
  const prevMonth = data[data.length - 2]?.views ?? 0;
  const monthChange =
    prevMonth > 0 ? Math.round(((thisMonth - prevMonth) / prevMonth) * 100) : 0;

  const overview = analytics?.overview;

  const cards = [
    {
      label: "مجموع بازدید سال",
      value: totalViews,
      hint: "بازدید صفحات در ۱۲ ماه",
      accent: "text-blue-600",
      ring: "from-primary to-primary/70",
    },
    {
      label: "میانگین بازدید ماهانه",
      value: averageViews,
      hint: "متوسط ماهانه صفحات",
      accent: "text-emerald-600",
      ring: "from-emerald-500 to-teal-500",
    },
    {
      label: "تغییر بازدید ماه جاری",
      value: monthChange,
      suffix: "٪",
      hint:
        monthChange > 0
          ? "روند صعودی نسبت به ماه قبل"
          : monthChange < 0
            ? "روند نزولی نسبت به ماه قبل"
            : "بدون تغییر محسوس",
      accent:
        monthChange > 0
          ? "text-emerald-600"
          : monthChange < 0
            ? "text-rose-600"
            : "text-slate-600",
      ring: "from-purple-500 to-fuchsia-500",
      signed: true,
    },
    {
      label: "کل نظرات",
      value: overview?.totalComments ?? 0,
      hint: `${formatFa(overview?.newCommentsThisMonth ?? 0)} نظر این ماه`,
      accent: "text-violet-600",
      ring: "from-violet-500 to-purple-500",
    },
    {
      label: "کل جستجوها",
      value: overview?.totalSearches ?? 0,
      hint: "جستجوهای ثبت‌شده",
      accent: "text-amber-600",
      ring: "from-amber-500 to-orange-500",
    },
    {
      label: "کاربران فعال (۳۰ روز)",
      value: overview?.activeUsersMonthly ?? 0,
      hint: `${formatFa(overview?.activeUsersDaily ?? 0)} نفر در ۲۴ ساعت`,
      accent: "text-cyan-600",
      ring: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-xs font-medium ${card.accent}`}>{card.label}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900 tabular-nums">
                {card.signed && card.value > 0 ? "+" : ""}
                {formatFa(Math.abs(card.value))}
                {card.suffix ?? ""}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-white/70 p-2.5 shadow-sm ring-1 ring-white/40">
              <div
                className={`h-full w-full rounded-xl bg-linear-to-br ${card.ring}`}
              />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
