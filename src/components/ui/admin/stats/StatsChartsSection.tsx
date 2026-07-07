"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, BarChart } from "./StatsCharts";
import { StatsChartCard } from "./StatsChartCard";

type PriceInquiry = {
  _id: string;
  type: string;
  productId:
    | {
        _id: string;
        slug: string;
      }
    | string
    | null;
  channel: string;
  meta: {
    pathname: string;
    referrer: string;
    source?: string;
  };
  ip: string;
  userAgent: string;
  createdAt: string;
};

type PriceActionApiResponse = {
  success: boolean;
  data: PriceInquiry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-slate-800">
      <span className={`h-5 w-1.5 rounded-full ${color}`} />
      {title}
    </h2>
  );
}

const MONTHS_FA = [
  "ژانویه",
  "فوریه",
  "مارس",
  "آوریل",
  "مه",
  "ژوئن",
  "جولای",
  "اوت",
  "سپتامبر",
  "اکتبر",
  "نوامبر",
  "دسامبر",
];

function formatMonthLabel(iso: string) {
  const [year, month] = iso.split("-");
  const m = parseInt(month, 10);
  return `${MONTHS_FA[m - 1]} ${year}`;
}

function formatDayLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
}

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function groupByMonth(data: PriceInquiry[]) {
  return data.reduce<Record<string, number>>((acc, curr) => {
    const date = new Date(curr.createdAt);
    const monthLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[monthLabel] = (acc[monthLabel] ?? 0) + 1;
    return acc;
  }, {});
}

function groupByChannel(data: PriceInquiry[]) {
  return data.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.channel] = (acc[curr.channel] ?? 0) + 1;
    return acc;
  }, {});
}

function groupByProduct(data: PriceInquiry[], topN = 6) {
  const counts: Record<string, { name: string; count: number }> = {};

  data.forEach((d) => {
    const slug =
      d.productId && typeof d.productId === "object" && "slug" in d.productId
        ? d.productId.slug
        : "نامشخص";

    counts[slug] = counts[slug] || { name: slug, count: 0 };
    counts[slug].count += 1;
  });

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

function groupByDay(data: PriceInquiry[]) {
  const result: Record<string, number> = {};
  data.forEach((d) => {
    const date = new Date(d.createdAt);
    const day = toLocalDateKey(date);
    result[day] = (result[day] ?? 0) + 1;
  });
  return result;
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
      <span>{message}</span>
      <button
        className="rounded border bg-red-100 px-2 py-1 text-xs text-red-900 transition hover:bg-red-200"
        onClick={onRetry}
      >
        تلاش مجدد
      </button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-40 flex-col items-center justify-center text-slate-400">
      <svg width={40} height={40} fill="none" viewBox="0 0 40 40">
        <rect width="40" height="40" rx="8" fill="#f1f5f9" />
        <path
          d="M10 23a10 10 0 0 1 20 0"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="17" r="2.5" fill="#cbd5e1" />
      </svg>
      <div className="mt-2 text-sm">{message}</div>
    </div>
  );
}

export function StatsChartsSection() {
  const [loading, setLoading] = useState(true);
  const [priceActions, setPriceActions] = useState<PriceInquiry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/actions/price", {
        cache: "no-store",
      });

      const json: PriceActionApiResponse = await res.json();

      console.log("PRICE API RESPONSE:", json);

      if (json.success && Array.isArray(json.data)) {
        setPriceActions(json.data);
      } else {
        setPriceActions([]);
        setError("خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید.");
      }
    } catch (err) {
      console.error("PRICE API ERROR:", err);
      setPriceActions([]);
      setError(
        "خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید یا بعداً تلاش کنید.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const queriesByMonth = groupByMonth(priceActions);
  const queriesByChannel = groupByChannel(priceActions);
  const topProduct = groupByProduct(priceActions);
  const dayCountsRaw = groupByDay(priceActions);

  const lastNDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return toLocalDateKey(d);
  });

  const areaChartData = Object.entries(queriesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: formatMonthLabel(month),
      views: count,
    }));

  const barChannelData = Object.entries(queriesByChannel).map(
    ([channel, count]) => ({
      month: channel,
      views: count,
    }),
  );

  const barProductData = topProduct.map((prod) => ({
    month: prod.name,
    views: prod.count,
  }));

  const dailyTrendData = lastNDays.map((day) => ({
    month: formatDayLabel(day),
    views: dayCountsRaw[day] ?? 0,
  }));

  return (
    <div className="space-y-10">
      <section>
        <SectionTitle title="آمار استعلام قیمت محصولات" color="bg-cyan-500" />

        {error && <ErrorBanner message={error} onRetry={fetchData} />}

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <StatsChartCard
            title="روند ماهانه استعلام قیمت"
            description="نمودار تعداد درخواست ثبت‌شده برای استعلام قیمت در هر ماه."
            className="lg:col-span-2"
          >
            {loading ? (
              <div className="flex h-40 items-center justify-center animate-pulse text-sky-800">
                <span>در حال دریافت داده...</span>
              </div>
            ) : areaChartData.length === 0 ? (
              <EmptyState message="هیچ داده‌ای برای نمایش روند ماهانه پیدا نشد." />
            ) : (
              <AreaChart
                data={areaChartData}
                color="#06b6d4"
                label="استعلام قیمت"
              />
            )}
          </StatsChartCard>

          <StatsChartCard
            title="تفکیک کانال‌های استعلام"
            description="درخواست‌های استعلام قیمت از کانال‌های مختلف مانند واتساپ، تلگرام و غیره."
          >
            {loading ? (
              <div className="flex h-40 items-center justify-center animate-pulse text-sky-800">
                <span>در حال دریافت داده...</span>
              </div>
            ) : barChannelData.length === 0 ? (
              <EmptyState message="هیچ داده‌ای از کانال‌های استعلام به دست نیامد." />
            ) : (
              <BarChart data={barChannelData} />
            )}
          </StatsChartCard>

          <StatsChartCard
            title="محصولات پرجستجو برای استعلام"
            description="لیست ۶ محصول با بیشترین میزان استعلام قیمت ثبت‌شده."
          >
            {loading ? (
              <div className="flex h-40 items-center justify-center animate-pulse text-sky-800">
                <span>در حال دریافت داده...</span>
              </div>
            ) : barProductData.length === 0 ? (
              <EmptyState message="داده‌ای برای محصولات پرمراجعه وجود ندارد." />
            ) : (
              <BarChart data={barProductData} />
            )}
          </StatsChartCard>

          <StatsChartCard
            title="ترند روزانه استعلام قیمت"
            description="تعداد درخواست ثبت‌شده برای استعلام قیمت در هر روز (۱۴ روز اخیر)"
            className="lg:col-span-2"
          >
            {loading ? (
              <div className="flex h-40 items-center justify-center animate-pulse text-sky-800">
                <span>در حال دریافت داده...</span>
              </div>
            ) : dailyTrendData.every((t) => t.views === 0) ? (
              <EmptyState message="داده‌ای از ترند روزانه موجود نیست." />
            ) : (
              <AreaChart
                data={dailyTrendData}
                color="#3b82f6"
                label="استعلام روزانه"
              />
            )}
          </StatsChartCard>
        </div>
      </section>
    </div>
  );
}
