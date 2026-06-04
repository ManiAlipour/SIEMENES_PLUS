"use client";

import {
  MultiLineChart,
  StackedBarChart,
  MixedBarLineChart,
  HorizontalBarChart,
  MixPieChart,
  DailyEngagementChart,
  AreaChart,
  BeautifulLineChart,
  BarChart,
  DonutChart,
  DailyViewsChart,
  type MultiSeries,
} from "./StatsCharts";
import { StatsChartCard } from "./StatsChartCard";
import type { AdminAnalyticsData } from "./AnalyticsLists";

type Props = {
  analytics: AdminAnalyticsData;
  monthlyViews: { month: string; views: number }[];
};

function SectionTitle({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
      <span className={`h-4 w-1 rounded-full ${color}`} />
      {title}
    </h2>
  );
}

export function StatsChartsSection({ analytics, monthlyViews }: Props) {
  const engagementSeries: MultiSeries[] = [
    {
      label: "نظرات",
      data: analytics.monthlyComments ?? [],
      color: "#8b5cf6",
    },
    {
      label: "جستجو",
      data: analytics.monthlySearches ?? [],
      color: "#f59e0b",
    },
    {
      label: "تعامل",
      data: analytics.monthlyInteractions ?? [],
      color: "#ef4444",
    },
    {
      label: "پیام تماس",
      data: analytics.monthlyContacts ?? [],
      color: "#06b6d4",
    },
  ];

  const trafficCompare: MultiSeries[] = [
    {
      label: "بازدید صفحات",
      data: monthlyViews,
      color: "#3b82f6",
    },
    {
      label: "بازدید محصولات",
      data: analytics.productViewsMonthly ?? [],
      color: "#10b981",
    },
  ];

  const topSearchLabels = analytics.topSearches
    .slice(0, 6)
    .map((s) => s._id);
  const topSearchValues = analytics.topSearches
    .slice(0, 6)
    .map((s) => s.total);

  const topProductLabels = (analytics.popularProducts ?? [])
    .slice(0, 6)
    .map((p) => p.name ?? "محصول");
  const topProductValues = (analytics.popularProducts ?? [])
    .slice(0, 6)
    .map((p) => p.views);

  const monthLabels = monthlyViews.map((m) => m.month);

  return (
    <div className="space-y-10">
      {/* ── فعالیت روزانه ── */}
      <section>
        <SectionTitle title="فعالیت روزانه (۷ روز اخیر)" color="bg-cyan-500" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {analytics.dailyEngagement && analytics.dailyEngagement.length > 0 && (
            <StatsChartCard
              title="ترکیب فعالیت‌ها — خطی"
              description="بازدید صفحه، محصول، نظر و جستجو در هر روز."
              className="lg:col-span-2"
            >
              <DailyEngagementChart data={analytics.dailyEngagement} />
            </StatsChartCard>
          )}
          {analytics.dailyViews && analytics.dailyViews.length > 0 && (
            <StatsChartCard
              title="بازدید صفحات — میله‌ای"
              description="تعداد بازدید صفحات در هر روز."
            >
              <DailyViewsChart data={analytics.dailyViews} />
            </StatsChartCard>
          )}
          {analytics.dailyEngagement && (
            <StatsChartCard
              title="جستجو و نظر — میله‌ای"
              description="مقایسه جستجوها و نظرات ثبت‌شده روزانه."
            >
              <BarChart
                data={analytics.dailyEngagement.map((d) => ({
                  month: d.day,
                  views: d.searches + d.comments,
                }))}
              />
            </StatsChartCard>
          )}
        </div>
      </section>

      {/* ── ترافیک ── */}
      <section>
        <SectionTitle title="ترافیک و بازدید" color="bg-blue-500" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StatsChartCard
            title="مقایسه بازدید صفحه و محصول"
            description="روند دو نوع بازدید در ۱۲ ماه."
            className="lg:col-span-2"
          >
            <MultiLineChart series={trafficCompare} />
          </StatsChartCard>

          <StatsChartCard
            title="ترکیب انواع تعامل"
            description="سهم هر نوع فعالیت از کل تعامل سایت."
          >
            {(analytics.engagementMix?.length ?? 0) > 0 ? (
              <MixPieChart slices={analytics.engagementMix ?? []} />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                داده‌ای موجود نیست
              </div>
            )}
          </StatsChartCard>

          <StatsChartCard
            title="بازدید صفحات — خطی"
            description="روند ماهانه بازدید صفحات."
            className="lg:col-span-2"
          >
            <BeautifulLineChart data={monthlyViews} />
          </StatsChartCard>

          <StatsChartCard
            title="بازدید صفحات — دونات"
            description="سهم هر ماه از کل بازدید."
          >
            <DonutChart data={monthlyViews} />
          </StatsChartCard>

          {analytics.productViewsMonthly && (
            <StatsChartCard
              title="بازدید صفحات + نظرات"
              description="میله‌ای بازدید و خطی نظرات — دو محور."
              className="lg:col-span-2"
            >
              <MixedBarLineChart
                labels={monthLabels}
                barData={monthlyViews.map((m) => m.views)}
                barLabel="بازدید صفحات"
                lineData={(analytics.monthlyComments ?? []).map((m) => m.views)}
                lineLabel="نظرات"
                barColor="#6366f1"
                lineColor="#8b5cf6"
              />
            </StatsChartCard>
          )}
        </div>
      </section>

      {/* ── تعامل کاربران ── */}
      <section>
        <SectionTitle title="تعامل و مشارکت کاربران" color="bg-violet-500" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StatsChartCard
            title="فعالیت‌های ماهانه — stacked"
            description="تجمیع نظر، جستجو، تعامل و پیام تماس."
            className="lg:col-span-2"
          >
            <StackedBarChart series={engagementSeries} />
          </StatsChartCard>

          <StatsChartCard
            title="ثبت‌نام کاربران — area"
            description="روند عضویت کاربران جدید در هر ماه."
          >
            <AreaChart
              data={analytics.monthlyUsers ?? []}
              color="#6366f1"
              label="کاربر جدید"
            />
          </StatsChartCard>

          <StatsChartCard
            title="نظرات ماهانه — میله‌ای"
            description="تعداد نظرات ثبت‌شده در هر ماه."
          >
            <BarChart data={analytics.monthlyComments ?? []} />
          </StatsChartCard>

          <StatsChartCard
            title="جستجو و تعامل — خطی"
            description="مقایسه جستجوها و رویدادهای تعاملی."
            className="lg:col-span-2"
          >
            <MultiLineChart
              series={[
                {
                  label: "جستجو",
                  data: analytics.monthlySearches ?? [],
                  color: "#f59e0b",
                },
                {
                  label: "تعامل",
                  data: analytics.monthlyInteractions ?? [],
                  color: "#ef4444",
                },
              ]}
            />
          </StatsChartCard>
        </div>
      </section>

      {/* ── محتوا ── */}
      <section>
        <SectionTitle title="محتوا و موجودی" color="bg-emerald-500" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StatsChartCard
            title="ترکیب محتوای سایت"
            description="توزیع محصولات، وبلاگ، پست و نظرات."
          >
            {(analytics.contentMix?.length ?? 0) > 0 ? (
              <MixPieChart slices={analytics.contentMix ?? []} />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                داده‌ای موجود نیست
              </div>
            )}
          </StatsChartCard>

          <StatsChartCard
            title="پیام‌های تماس — area"
            description="روند دریافت پیام تماس ماهانه."
          >
            <AreaChart
              data={analytics.monthlyContacts ?? []}
              color="#06b6d4"
              label="پیام"
            />
          </StatsChartCard>

          <StatsChartCard
            title="توزیع نظرات — دونات"
            description="سهم هر نوع (وبلاگ / محصول / پست)."
          >
            {(analytics.commentsByType?.length ?? 0) > 0 ? (
              <DonutChart
                data={(analytics.commentsByType ?? []).map((c) => ({
                  month:
                    c._id === "blogPost"
                      ? "وبلاگ"
                      : c._id === "product"
                        ? "محصول"
                        : c._id === "post"
                          ? "پست"
                          : c._id,
                  views: c.total,
                }))}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                نظری ثبت نشده
              </div>
            )}
          </StatsChartCard>
        </div>
      </section>

      {/* ── رتبه‌بندی افقی ── */}
      <section>
        <SectionTitle title="رتبه‌بندی" color="bg-amber-500" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {topSearchLabels.length > 0 && (
            <StatsChartCard
              title="جستجوهای برتر — افقی"
              description="پرتکرارترین عبارت‌های جستجو."
            >
              <HorizontalBarChart
                labels={topSearchLabels}
                values={topSearchValues}
                color="#f59e0b"
              />
            </StatsChartCard>
          )}
          {topProductLabels.length > 0 && (
            <StatsChartCard
              title="محصولات پربازدید — افقی"
              description="محصولاتی که بیشترین بازدید را داشته‌اند."
            >
              <HorizontalBarChart
                labels={topProductLabels}
                values={topProductValues}
                color="#10b981"
              />
            </StatsChartCard>
          )}
        </div>
      </section>
    </div>
  );
}
