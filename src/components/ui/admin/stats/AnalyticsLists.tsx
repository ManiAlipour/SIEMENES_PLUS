"use client";

import { formatFa } from "./StatsCharts";

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

export type AdminAnalyticsData = {
  monthlyViews: { month: string; views: number }[];
  topSearches: TopItem[];
  eventStats: TopItem[];
  overview: OverviewStats;
  trendStats: TrendStats;
  topPages?: TopItem[];
};

type Props = {
  analytics: AdminAnalyticsData;
};

export function AnalyticsLists({ analytics }: Props) {
  return (
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
  );
}

