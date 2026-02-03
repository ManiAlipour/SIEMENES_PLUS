"use client";

import {
  BeautifulLineChart,
  BarChart,
  DonutChart,
  DualLineChart,
} from "@/components/ui/admin/stats/StatsCharts";
import { StatsSkeleton } from "@/components/ui/admin/stats/StatsSkeleton";
import { SummaryStatsCards } from "@/components/ui/admin/stats/SummaryStatsCards";
import { AnalyticsLists } from "@/components/ui/admin/stats/AnalyticsLists";
import { StatsPageHeader } from "@/components/ui/admin/stats/StatsPageHeader";
import { StatsEmptyState } from "@/components/ui/admin/stats/StatsEmptyState";
import { StatsChartCard } from "@/components/ui/admin/stats/StatsChartCard";
import { useAdminStats } from "@/hooks/useAdminStats";

export default function AdminStatPage() {
  const { data, analytics, isMock, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600 shadow-sm dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!data.length) {
    return <StatsEmptyState />;
  }

  return (
    <div className="space-y-10">
      <StatsPageHeader isMock={isMock} />

      <div>
        <SummaryStatsCards data={data} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatsChartCard
          title="روند بازدید سالانه"
          description="نمایش جزئیات رشد و فراز و فرود بازدید در طول سال."
          className="lg:col-span-2"
        >
          <BeautifulLineChart data={data} />
        </StatsChartCard>

        <StatsChartCard
          title="مقایسه با سال قبل"
          description="بررسی وضعیت امسال نسبت به سال گذشته در هر ماه."
        >
          <DualLineChart data={data} />
        </StatsChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatsChartCard
          title="سهم هر ماه از بازدید سال (ستونی)"
          description="توزیع بازدید بین ماه‌های مختلف به‌صورت نمودار میله‌ای."
        >
          <BarChart data={data} />
        </StatsChartCard>

        <StatsChartCard
          title="سهم ماه‌ها به‌صورت دایره‌ای"
          description="نمایش درصد سهم هر ماه از کل بازدید سال در قالب چارت دایره‌ای."
        >
          <DonutChart data={data} />
        </StatsChartCard>
      </div>

      {analytics && <AnalyticsLists analytics={analytics} />}
    </div>
  );
}
