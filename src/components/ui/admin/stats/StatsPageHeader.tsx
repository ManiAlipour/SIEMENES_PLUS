"use client";

type Props = {
  isMock?: boolean;
};

export function StatsPageHeader({ isMock = false }: Props) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          آمار بازدید سایت
        </h1>
        <p className="mt-1 text-xs text-gray-500 md:text-sm dark:text-gray-400">
          نمای کلی از وضعیت بازدید صفحات در ۱۲ ماه اخیر؛ برای تحلیل روند رشد و
          رفتار کاربران.
        </p>
      </div>
      {isMock && (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          داده‌ها نمونه هستند
        </span>
      )}
    </div>
  );
}
