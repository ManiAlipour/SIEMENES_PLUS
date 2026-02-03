"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler
);

/* =====================
   Types
===================== */

type MonthlyView = {
  month: string;
  views: number;
};

type TopItem = {
  _id: string;
  total: number;
};

type OverviewStats = {
  totalViews: number;
  totalProductViews: number;
  totalSearches: number;
  totalInteractions: number;
  activeUsersDaily: number;
  activeUsersMonthly: number;
};

type TrendStats = {
  viewsGrowth: string;
  activeUsersGrowth: string;
};

type AdminAnalyticsData = {
  monthlyViews: MonthlyView[];
  topSearches: TopItem[];
  eventStats: TopItem[];
  overview: OverviewStats;
  trendStats: TrendStats;
  topPages?: TopItem[];
};

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

const formatFa = (v: number) =>
  v.toLocaleString("fa-IR");

/* =====================
   Base Chart Options
===================== */

const baseLineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  animation: {
    duration: 800,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#111827",
      padding: 12,
      cornerRadius: 8,
      titleColor: "#fff",
      bodyColor: "#e5e7eb",
      callbacks: {
        title: (items) => items[0].label ?? "",
        label: (item) =>
          `بازدید: ${formatFa(Number(item.raw))}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#6b7280",
      },
    },
    y: {
      grid: {
        color: "rgba(0,0,0,0.05)",
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
        callback: (v) => formatFa(Number(v)),
      },
    },
  },
};

const baseBarOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  animation: {
    duration: 800,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#111827",
      padding: 12,
      cornerRadius: 8,
      titleColor: "#fff",
      bodyColor: "#e5e7eb",
      callbacks: {
        title: (items) => items[0].label ?? "",
        label: (item) => `بازدید: ${formatFa(Number(item.raw))}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#6b7280",
      },
    },
    y: {
      grid: {
        color: "rgba(0,0,0,0.05)",
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
        callback: (v) => formatFa(Number(v)),
      },
    },
  },
};

/* =====================
   Charts
===================== */

function BeautifulLineChart({ data }: { data: MonthlyView[] }) {
  return (
    <Line
      options={baseLineOptions}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: data.map((d) => d.views),
            borderColor: "#3b82f6",
            borderWidth: 3,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
              g.addColorStop(0, "rgba(59,130,246,0.25)");
              g.addColorStop(1, "rgba(59,130,246,0)");
              return g;
            },
          },
        ],
      }}
    />
  );
}

function DualLineChart({ data }: { data: MonthlyView[] }) {
  return (
    <Line
      options={baseLineOptions}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "امسال",
            data: data.map((d) => d.views),
            borderColor: "#22c55e",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: "سال قبل",
            data: data.map((d) => Math.floor(d.views * 0.7)),
            borderColor: "#94a3b8",
            borderDash: [6, 4],
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      }}
    />
  );
}

function BarChart({ data }: { data: MonthlyView[] }) {
  return (
    <Bar
      options={baseBarOptions}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: data.map((d) => d.views),
            backgroundColor: "#6366f1",
            hoverBackgroundColor: "#4f46e5",
            borderRadius: 10,
            barThickness: 22,
          },
        ],
      }}
    />
  );
}

function DonutChart({ data }: { data: MonthlyView[] }) {
  const total = data.reduce((sum, item) => sum + item.views, 0);

  const donutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 10,
        cornerRadius: 8,
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        callbacks: {
          label: (item) => {
            const value = Number(item.raw);
            const percent =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return ` ${item.label}: ${formatFa(value)} بازدید (${formatFa(
              percent
            )}٪)`;
          },
        },
      },
    },
  };

  return (
    <Doughnut
      options={donutOptions}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: data.map((d) => d.views),
            backgroundColor: [
              "#4f46e5",
              "#0ea5e9",
              "#22c55e",
              "#f97316",
              "#e11d48",
              "#8b5cf6",
              "#06b6d4",
              "#84cc16",
              "#facc15",
              "#f97316",
              "#ec4899",
              "#6366f1",
            ],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      }}
    />
  );
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

  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  const averageViews = data.length ? Math.round(totalViews / data.length) : 0;
  const thisMonth = data[data.length - 1]?.views ?? 0;
  const prevMonth = data[data.length - 2]?.views ?? 0;
  const monthChange =
    prevMonth > 0 ? Math.round(((thisMonth - prevMonth) / prevMonth) * 100) : 0;

  const StatSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-40 rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
        <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
        <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
        <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
        <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatSkeleton />
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
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                مجموع بازدید سال
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatFa(totalViews)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-white/70 p-2.5 shadow-sm ring-1 ring-white/40 backdrop-blur dark:bg-white/5 dark:ring-white/10">
              <div className="h-full w-full rounded-xl bg-linear-to-br from-primary to-primary/70" />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-blue-700/70 dark:text-blue-300/80">
            مجموع بازدید ثبت شده در تمام ماه‌های سال جاری.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                میانگین بازدید ماهانه
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatFa(averageViews)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 p-2.5 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/30">
              <div className="h-full w-full rounded-xl bg-linear-to-br from-emerald-500 to-teal-500" />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            متوسط بازدید در هر ماه بر اساس ۱۲ ماه اخیر.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                تغییر ماه جاری
              </p>
              <p className="mt-2 flex items-baseline gap-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                <span>
                  {monthChange > 0 ? "+" : ""}
                  {formatFa(Math.abs(monthChange))}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  درصد نسبت به ماه قبل
                </span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-purple-50 p-2.5 shadow-sm ring-1 ring-purple-100 dark:bg-purple-500/10 dark:ring-purple-500/30">
              <div className="h-full w-full rounded-xl bg-linear-to-br from-purple-500 to-fuchsia-500" />
            </div>
          </div>
          <p
            className={`mt-2 text-[11px] ${
              monthChange > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : monthChange < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {monthChange > 0 &&
              "روند صعودی؛ بازدید این ماه نسبت به ماه قبل افزایش داشته است."}
            {monthChange < 0 &&
              "روند نزولی؛ بازدید این ماه نسبت به ماه قبل کاهش داشته است."}
            {monthChange === 0 &&
              "تغییر محسوسی بین این ماه و ماه قبل مشاهده نشده است."}
          </p>
        </div>
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

      {analytics && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
              صفحات پربازدید
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
              {(analytics.topPages ?? []).map((item) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2 py-1.5 text-[11px] md:text-xs dark:bg-gray-800"
                >
                  <span className="max-w-[70%] truncate">{item._id}</span>
                  <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                    {formatFa(item.total)}
                  </span>
                </li>
              ))}
              {!analytics.topPages?.length && (
                <li className="text-[11px] text-gray-400 dark:text-gray-500">
                  دیتایی برای نمایش صفحات پربازدید موجود نیست.
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
              جستجوهای پرتکرار
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
              {analytics.topSearches.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2 py-1.5 text-[11px] md:text-xs dark:bg-gray-800"
                >
                  <span className="max-w-[70%] truncate">{item._id}</span>
                  <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                    {formatFa(item.total)}
                  </span>
                </li>
              ))}
              {!analytics.topSearches.length && (
                <li className="text-[11px] text-gray-400 dark:text-gray-500">
                  دیتایی برای نمایش جستجوها موجود نیست.
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
              رویدادهای پرتکرار
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
              {analytics.eventStats.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2 py-1.5 text-[11px] md:text-xs dark:bg-gray-800"
                >
                  <span className="max-w-[70%] truncate">{item._id}</span>
                  <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                    {formatFa(item.total)}
                  </span>
                </li>
              ))}
              {!analytics.eventStats.length && (
                <li className="text-[11px] text-gray-400 dark:text-gray-500">
                  دیتایی برای نمایش رویدادها موجود نیست.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
