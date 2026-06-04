"use client";

import { StatsSkeleton } from "@/components/ui/admin/stats/StatsSkeleton";
import { SummaryStatsCards } from "@/components/ui/admin/stats/SummaryStatsCards";
import { AnalyticsLists } from "@/components/ui/admin/stats/AnalyticsLists";
import { StatsPageHeader } from "@/components/ui/admin/stats/StatsPageHeader";
import { StatsEmptyState } from "@/components/ui/admin/stats/StatsEmptyState";
import { OverviewKpiGrid } from "@/components/ui/admin/stats/OverviewKpiGrid";
import { ContentStatsSection } from "@/components/ui/admin/stats/ContentStatsSection";
import { StatsChartsSection } from "@/components/ui/admin/stats/StatsChartsSection";
import { useAdminStats } from "@/hooks/useAdminStats";

export default function AdminStatPage() {
  const {
    data,
    analytics,
    isMock,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
  } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatsSkeleton />
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
          {error}
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={refresh}
            className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return <StatsEmptyState />;
  }

  return (
    <div className="space-y-10 pb-8">
      <StatsPageHeader
        isMock={isMock}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      />

      {analytics && <OverviewKpiGrid analytics={analytics} />}

      {analytics && <ContentStatsSection analytics={analytics} />}

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="h-4 w-1 rounded-full bg-blue-500" />
          خلاصه عددی
        </h2>
        <SummaryStatsCards data={data} analytics={analytics} />
      </div>

      {analytics && (
        <StatsChartsSection analytics={analytics} monthlyViews={data} />
      )}

      {analytics && <AnalyticsLists analytics={analytics} />}
    </div>
  );
}
