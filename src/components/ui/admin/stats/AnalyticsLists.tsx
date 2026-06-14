"use client";

import { formatFa } from "./StatsCharts";

type TopItem = {
  _id: string;
  total: number;
};

type PopularProduct = {
  _id: string;
  views: number;
  name?: string;
  slug?: string;
};

type OverviewStats = {
  totalViews: number;
  totalProductViews: number;
  totalSearches: number;
  totalInteractions: number;
  activeUsersDaily: number;
  activeUsersMonthly: number;
  totalUsers: number;
  verifiedUsers: number;
  totalProducts: number;
  totalBlogPosts: number;
  totalPosts: number;
  totalCategories: number;
  totalComments: number;
  totalContacts: number;
  pendingContacts: number;
  answeredContacts: number;
  newUsersThisMonth: number;
  newCommentsThisMonth: number;
  commentsToday: number;
  pageViewsToday: number;
  pageViewsLast7Days: number;
  pageViewsThisMonth: number;
  pageViewsPrevMonth: number;
  productViewsThisMonth: number;
  newBlogPostsThisMonth: number;
};

export type TrendStats = {
  viewsGrowth: string;
  monthlyViewsChange: string;
  activeUsersGrowth: string;
};

export type DailyView = {
  day: string;
  date: string;
  views: number;
};

export type DailyEngagement = {
  day: string;
  date: string;
  pageViews: number;
  productViews: number;
  comments: number;
  searches: number;
};

export type MixSlice = {
  label: string;
  value: number;
};

export type AdminAnalyticsData = {
  monthlyViews: { month: string; views: number }[];
  dailyViews?: DailyView[];
  dailyEngagement?: DailyEngagement[];
  productViewsMonthly?: { month: string; views: number }[];
  monthlyComments?: { month: string; views: number }[];
  monthlyUsers?: { month: string; views: number }[];
  monthlySearches?: { month: string; views: number }[];
  monthlyInteractions?: { month: string; views: number }[];
  monthlyContacts?: { month: string; views: number }[];
  contentMix?: MixSlice[];
  engagementMix?: MixSlice[];
  popularProducts?: PopularProduct[];
  topSearches: TopItem[];
  eventStats: TopItem[];
  overview: OverviewStats;
  trendStats: TrendStats;
  topPages?: TopItem[];
  commentsByType?: TopItem[];
  contactsByStatus?: TopItem[];
};

type Props = {
  analytics: AdminAnalyticsData;
};

function RankList({
  title,
  items,
  emptyText,
  renderLabel,
  maxTotal,
}: {
  title: string;
  items: { id: string; label: string; total: number }[];
  emptyText: string;
  renderLabel?: (label: string) => React.ReactNode;
  maxTotal?: number;
}) {
  const peak = maxTotal ?? Math.max(...items.map((i) => i.total), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm h-full">
      <p className="mb-4 text-xs font-semibold text-slate-700">{title}</p>
      {items.length === 0 ? (
        <p className="text-[11px] text-slate-400 py-4 text-center">
          {emptyText}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li key={item.id}>
              <div className="mb-1 flex items-center justify-between gap-2 text-[11px] md:text-xs">
                <span className="flex min-w-0 items-center gap-2 text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                    {formatFa(index + 1)}
                  </span>
                  <span className="truncate">
                    {renderLabel ? renderLabel(item.label) : item.label}
                  </span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-slate-900">
                  {formatFa(item.total)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-cyan-500 to-cyan-400 transition-all"
                  style={{
                    width: `${Math.max((item.total / peak) * 100, 4)}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AnalyticsLists({ analytics }: Props) {
  const topPages = (analytics.topPages ?? []).map((item) => ({
    id: item._id,
    label: item._id,
    total: item.total,
  }));

  const topSearches = analytics.topSearches.map((item) => ({
    id: item._id,
    label: item._id,
    total: item.total,
  }));

  const eventStats = analytics.eventStats.map((item) => ({
    id: item._id,
    label: item._id,
    total: item.total,
  }));

  const popularProducts = (analytics.popularProducts ?? []).map((item) => ({
    id: String(item._id),
    label: item.name ?? "محصول",
    total: item.views,
  }));

  return (
    <section aria-labelledby="analytics-lists-heading">
      <h2
        id="analytics-lists-heading"
        className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"
      >
        <span className="h-4 w-1 rounded-full bg-violet-500" />
        رتبه‌بندی و تحلیل رفتار
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RankList
          title="صفحات پربازدید"
          items={topPages}
          emptyText="هنوز بازدید صفحه‌ای ثبت نشده."
        />
        <RankList
          title="محصولات پربازدید"
          items={popularProducts}
          emptyText="هنوز بازدید محصولی ثبت نشده."
        />
        <RankList
          title="جستجوهای پرتکرار"
          items={topSearches}
          emptyText="هنوز جستجویی ثبت نشده."
        />
        <RankList
          title="رویدادهای پرتکرار"
          items={eventStats}
          emptyText="هنوز رویدادی ثبت نشده."
        />
      </div>
    </section>
  );
}
