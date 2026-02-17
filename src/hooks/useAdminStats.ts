import { useEffect, useState } from "react";
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
  error: string | null;
};

/**
 * Hook to fetch and manage stats data from API
 */
export function useAdminStats(): UseAdminStatsReturn {
  const [data, setData] = useState<MonthlyView[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/analytics");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "خطا در دریافت داده‌ها");
        }

        const analyticsData: AdminAnalyticsData = result.data;

        setAnalytics(analyticsData);

        // Validate monthly data
        if (!isValidMonthlyData(analyticsData?.monthlyViews)) {
          setIsMock(true);
          setData(generateFakeMonthlyData());
        } else {
          setIsMock(false);
          setData(analyticsData.monthlyViews);
        }
      } catch (err: any) {
        console.error("Error fetching admin stats:", err);
        setError(err?.message || "خطا در دریافت داده‌های آماری");
        setIsMock(true);
        setData(generateFakeMonthlyData());
        setAnalytics(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, analytics, isMock, isLoading, error };
}
