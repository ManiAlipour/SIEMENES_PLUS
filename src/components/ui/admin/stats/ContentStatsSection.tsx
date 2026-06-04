"use client";

import {
  FiPackage,
  FiFileText,
  FiVideo,
  FiFolder,
  FiEdit3,
  FiMessageCircle,
} from "react-icons/fi";
import { formatFa } from "./StatsCharts";
import type { AdminAnalyticsData } from "./AnalyticsLists";

const TARGET_TYPE_LABELS: Record<string, string> = {
  product: "محصول",
  blogPost: "وبلاگ",
  post: "پست",
};

const CONTACT_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار پاسخ",
  answered: "پاسخ‌داده‌شده",
  closed: "بسته‌شده",
};

type Props = {
  analytics: AdminAnalyticsData;
};

function StatTile({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-bold text-slate-900 tabular-nums">
          {formatFa(value)}
        </p>
        {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

function BreakdownBar({
  items,
  labels,
}: {
  items: { _id: string; total: number }[];
  labels: Record<string, string>;
}) {
  const total = items.reduce((s, i) => s + i.total, 0);
  if (!total) {
    return (
      <p className="text-xs text-slate-400 py-2">داده‌ای موجود نیست.</p>
    );
  }

  const colors = [
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
  ];

  return (
    <div className="space-y-3">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {items.map((item, i) => (
          <div
            key={item._id}
            className={`${colors[i % colors.length]} transition-all`}
            style={{ width: `${(item.total / total) * 100}%` }}
            title={`${labels[item._id] ?? item._id}: ${item.total}`}
          />
        ))}
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={item._id}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className={`h-2 w-2 rounded-full ${colors[i % colors.length]}`}
              />
              {labels[item._id] ?? item._id}
            </span>
            <span className="font-semibold tabular-nums text-slate-800">
              {formatFa(item.total)}
              <span className="mr-1 font-normal text-slate-400">
                ({formatFa(Math.round((item.total / total) * 100))}٪)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContentStatsSection({ analytics }: Props) {
  const { overview } = analytics;

  return (
    <section aria-labelledby="content-stats-heading">
      <h2
        id="content-stats-heading"
        className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"
      >
        <span className="h-4 w-1 rounded-full bg-cyan-500" />
        آمار محتوا و موجودی
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile
          icon={<FiPackage className="text-emerald-600" size={18} />}
          label="محصولات"
          value={overview.totalProducts}
          color="bg-emerald-50"
        />
        <StatTile
          icon={<FiEdit3 className="text-cyan-600" size={18} />}
          label="مطالب وبلاگ"
          value={overview.totalBlogPosts}
          sub={`${formatFa(overview.newBlogPostsThisMonth ?? 0)} جدید این ماه`}
          color="bg-cyan-50"
        />
        <StatTile
          icon={<FiVideo className="text-orange-600" size={18} />}
          label="ویدیوها / پست‌ها"
          value={overview.totalPosts}
          color="bg-orange-50"
        />
        <StatTile
          icon={<FiFolder className="text-violet-600" size={18} />}
          label="دسته‌بندی‌ها"
          value={overview.totalCategories}
          color="bg-violet-50"
        />
        <StatTile
          icon={<FiMessageCircle className="text-teal-600" size={18} />}
          label="نظرات امروز"
          value={overview.commentsToday ?? 0}
          sub={`${formatFa(overview.newCommentsThisMonth ?? 0)} این ماه`}
          color="bg-teal-50"
        />
        <StatTile
          icon={<FiFileText className="text-slate-600" size={18} />}
          label="بازدید ۷ روز اخیر"
          value={overview.pageViewsLast7Days ?? 0}
          color="bg-slate-100"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-semibold text-slate-600">
            توزیع نظرات بر اساس نوع
          </p>
          <BreakdownBar
            items={analytics.commentsByType ?? []}
            labels={TARGET_TYPE_LABELS}
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-semibold text-slate-600">
            وضعیت پیام‌های تماس
          </p>
          <BreakdownBar
            items={analytics.contactsByStatus ?? []}
            labels={CONTACT_STATUS_LABELS}
          />
        </div>
      </div>
    </section>
  );
}
