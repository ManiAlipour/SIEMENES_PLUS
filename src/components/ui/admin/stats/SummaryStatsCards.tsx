"use client";

import { MonthlyView, formatFa } from "./StatsCharts";

type Props = {
  data: MonthlyView[];
};

export function SummaryStatsCards({ data }: Props) {
  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  const averageViews = data.length ? Math.round(totalViews / data.length) : 0;
  const thisMonth = data[data.length - 1]?.views ?? 0;
  const prevMonth = data[data.length - 2]?.views ?? 0;
  const monthChange =
    prevMonth > 0 ? Math.round(((thisMonth - prevMonth) / prevMonth) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* total views */}
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

      {/* avg views */}
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

      {/* month change */}
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
  );
}

