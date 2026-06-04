"use client";

import { FiRefreshCw } from "react-icons/fi";

type Props = {
  isMock?: boolean;
  lastUpdated?: string | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

export function StatsPageHeader({
  isMock = false,
  lastUpdated,
  isRefreshing = false,
  onRefresh,
}: Props) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          آمار و تحلیل سایت
        </h1>
        <p className="mt-1 text-xs text-slate-500 md:text-sm">
          ترافیک، تعامل، محتوا و رفتار کاربران — با انواع نمودار (خطی، میله‌ای،
          دایره‌ای، area، stacked و ترکیبی).
        </p>
        {formattedTime && (
          <p className="mt-1 text-[11px] text-slate-400">
            آخرین به‌روزرسانی: {formattedTime}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isMock && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            داده‌های نمونه
          </span>
        )}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-60 transition-colors"
          >
            <FiRefreshCw
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "در حال بارگذاری..." : "به‌روزرسانی"}
          </button>
        )}
      </div>
    </div>
  );
}
