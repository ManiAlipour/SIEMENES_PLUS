"use client";

import { useEffect, useState } from "react";
import {
  BeautifulLineChart,
  BarChart,
  DonutChart,
  DualLineChart,
  MonthlyView,
  formatFa,
} from "@/components/ui/admin/stats/StatsCharts";
import { StatsSkeleton } from "@/components/ui/admin/stats/StatsSkeleton";
import { SummaryStatsCards } from "@/components/ui/admin/stats/SummaryStatsCards";
import {
  AdminAnalyticsData,
  AnalyticsLists,
} from "@/components/ui/admin/stats/AnalyticsLists";

/* =====================
   Fake Data
===================== */

function generateFakeMonthlyData(): MonthlyView[] {
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  return months.map((m) => ({
    month: m,
    views: Math.floor(800 + Math.random() * 3000),
  }));
}

/* =====================
   Helpers
===================== */

function isValidMonthlyData(data?: MonthlyView[]) {
  if (!data || data.length === 0) return false;
  return data.some((i) => i.views > 0);
}

/* =====================
   Page
===================== */

export default function AdminStatPage() {
  const [data, setData] = useState<MonthlyView[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(({ data }: { data: AdminAnalyticsData }) => {
        setAnalytics(data);

        if (!isValidMonthlyData(data?.monthlyViews)) {
          setIsMock(true);
          setData(generateFakeMonthlyData());
        } else {
          setIsMock(false);
          setData(data.monthlyViews);
        }
      })
      .catch(() => {
        setIsMock(true);
        setData(generateFakeMonthlyData());
        setAnalytics(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatsSkeleton />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
        در حال حاضر داده‌ای برای نمایش آمار وجود ندارد.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            آمار بازدید سایت
          </h1>
          <p className="mt-1 text-xs text-gray-500 md:text-sm dark:text-gray-400">
            نمای کلی از وضعیت بازدید صفحات در ۱۲ ماه اخیر؛ برای تحلیل روند رشد و
            رفتار کاربران.
          </p>
        </div>
        {isMock && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            داده‌ها نمونه هستند
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryStatsCards data={data} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                روند بازدید سالانه
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                نمایش جزئیات رشد و فراز و فرود بازدید در طول سال.
              </p>
            </div>
          </div>
          <div className="h-72">
            <BeautifulLineChart data={data} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                مقایسه با سال قبل
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                بررسی وضعیت امسال نسبت به سال گذشته در هر ماه.
              </p>
            </div>
          </div>
          <div className="h-72">
            <DualLineChart data={data} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                سهم هر ماه از بازدید سال (ستونی)
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                توزیع بازدید بین ماه‌های مختلف به‌صورت نمودار میله‌ای.
              </p>
            </div>
          </div>
          <div className="h-72">
            <BarChart data={data} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                سهم ماه‌ها به‌صورت دایره‌ای
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                نمایش درصد سهم هر ماه از کل بازدید سال در قالب چارت دایره‌ای.
              </p>
            </div>
          </div>
          <div className="h-72">
            <DonutChart data={data} />
          </div>
        </div>
      </div>

      {analytics && <AnalyticsLists analytics={analytics} />}
    </div>
  );
}
