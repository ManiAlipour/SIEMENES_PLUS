"use client";

import AdminChartSection from "@/components/layouts/dash/admin/AdminChartSection";
import RecentActionsWidget from "@/components/layouts/dash/admin/RecentActionsWidget";
import InfoCard from "@/components/ui/admin/InfoCard";

export default function AdminDashboardPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen font-vazirmatn bg-gradient-to-br from-white to-[#f1f5f9]
                 px-6 md:px-10 py-8 transition-colors duration-300"
    >
      {/* Header Section */}
      <header className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
          داشبورد مدیریتی
        </h1>
      </header>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <InfoCard
          title="کاربران"
          desc="کاربران فعال"
          count={542}
          color="primary"
        />
        <InfoCard
          title="محصولات"
          desc="محصولات ثبت‌شده"
          count={128}
          color="success"
        />
        <InfoCard
          title="سفارشات"
          desc="در انتظار بررسی"
          count={37}
          color="warn"
        />
        <InfoCard
          title="تیکت‌ها"
          desc="در حال بررسی"
          count={12}
          color="danger"
        />
      </div>

      {/* Performance Summary */}
      <section
        className="rounded-2xl backdrop-blur-xl bg-white/75 border border-slate-200/60
                   shadow-[0_8px_20px_rgba(0,0,0,0.05)]
                   hover:shadow-[0_12px_28px_rgba(6,182,212,0.12)]
                   p-6 transition-all duration-300"
      >
        <h2 className="text-lg font-semibold text-[#1f2937] mb-4">
          شاخص عملکرد کلی
        </h2>

        <div className="space-y-5">
          {/* --- Progress Item 1 --- */}
          <div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>نرخ تعامل کاربران</span>
              <span>۷۸٪</span>
            </div>

            {/* Progress bar container */}
            <div className="h-[6px] w-full rounded-full bg-slate-200/60 overflow-hidden mt-1.5">
              <div className="h-full w-[78%] bg-gradient-to-r from-[#06b6d4] to-[#0e7490] rounded-full transition-all duration-700" />
            </div>
          </div>

          {/* --- Progress Item 2 --- */}
          <div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>تکمیل سفارشات</span>
              <span>۶۳٪</span>
            </div>

            <div className="h-[6px] w-full rounded-full bg-slate-200/60 overflow-hidden mt-1.5">
              <div className="h-full w-[63%] bg-gradient-to-r from-[#f59e0b] to-[#b45309] rounded-full transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <RecentActionsWidget />
      </div>

      {/* Chart Section */}
      <div className="mt-10">
        <AdminChartSection />
      </div>
    </div>
  );
}
