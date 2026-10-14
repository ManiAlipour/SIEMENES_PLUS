"use client";

import { FiRefreshCw } from "react-icons/fi";
import AdminPageHeading from "@/components/layouts/dash/admin/AdminPageHeading";
import { BarChart3 } from "lucide-react";

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

  return <AdminPageHeading
    title="آمار و تحلیل سایت"
    description={`ترافیک، تعامل، محتوا و استعلام قیمت محصولات${formattedTime ? ` · آخرین به‌روزرسانی ${formattedTime}` : ""}`}
    icon={BarChart3}
    eyebrow="گزارش عملکرد"
    actions={<>
      {isMock && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700">داده‌های نمونه</span>}
      {onRefresh && <button type="button" onClick={onRefresh} disabled={isRefreshing} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"><FiRefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />{isRefreshing ? "در حال بارگذاری..." : "به‌روزرسانی"}</button>}
    </>}
  />;
}
