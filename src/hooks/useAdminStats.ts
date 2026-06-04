import { useCallback, useEffect, useState } from "react";
import { MonthlyView } from "@/components/ui/admin/stats/StatsCharts";
import { AdminAnalyticsData } from "@/components/ui/admin/stats/AnalyticsLists";
import {
  generateFakeMonthlyData,
  isValidMonthlyData,
} from "@/lib/admin/statsUtils";

type UseAdminStatsReturn = {
  data: MonthlyView[];
  analytics: AdminAnalyticsData | null;
  isMock: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
  refresh: () => void;
};

export function useAdminStats(): UseAdminStatsReturn {
  const [data, setData] = useState<MonthlyView[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchStats = useCallback(async (silent = false) => {
    try {
      if (silent) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const response = await fetch("/api/admin/analytics", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "خطا در دریافت داده‌ها");
      }

      const analyticsData: AdminAnalyticsData = result.data;
      setAnalytics(analyticsData);
      setLastUpdated(result.timestamp ?? new Date().toISOString());

      if (!isValidMonthlyData(analyticsData?.monthlyViews)) {
        setIsMock(true);
        setData(generateFakeMonthlyData());
      } else {
        setIsMock(false);
        setData(analyticsData.monthlyViews);
      }
    } catch (err: unknown) {
      console.error("Error fetching admin stats:", err);
      setError(
        err instanceof Error ? err.message : "خطا در دریافت داده‌های آماری",
      );
      setIsMock(true);
      setData(generateFakeMonthlyData());
      setAnalytics(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = useCallback(() => {
    fetchStats(true);
  }, [fetchStats]);

  return {
    data,
    analytics,
    isMock,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
  };
}
