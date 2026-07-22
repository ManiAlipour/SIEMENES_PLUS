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
        <h1 className="text-xl font-extrabold tracking-tight text-[#0b1f33] md:text-2xl">
          آمار و تحلیل سایت
        </h1>
        <p className="mt-1 text-xs text-[#64748b] md:text-sm">
          ترافیک، تعامل، محتوا و استعلام قیمت محصولات
        </p>
        {formattedTime && (
          <p className="mt-1 text-[11px] text-[#94a3b8]">
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
            className="admin-btn-ghost text-xs"
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
