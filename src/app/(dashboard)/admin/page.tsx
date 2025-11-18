"use client";

import AdminChartSection from "@/components/layouts/dash/admin/AdminChartSection";
import InfoCard from "@/components/ui/admin/InfoCard";

export default function AdminDashboardPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen font-vazir bg-linear-to-br from-white to-[#f1f5f9]
                 px-6 md:px-10 py-8"
    >
      {/* 🧭 هدر صفحه */}
      <header className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
          داشبورد مدیریتی
        </h1>

        <span
          className="px-4 py-1.5 rounded-full text-sm font-medium text-primary
                     bg-primary/10 backdrop-blur-md border border-primary/30
                     shadow-[inset_0_0_6px_rgba(255,255,255,0.45)]
                     hover:bg-primary/20 transition-all duration-300"
        >
          Lux Industrial Refined Edition
        </span>
      </header>

      {/* 💠 کارت‌های آماری بالای صفحه */}
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

      <section className="rounded-2xl backdrop-blur-md bg-white/80 border border-slate-200/40 shadow p-6">
        <h2 className="text-lg font-semibold text-[#1f2937] mb-4">
          شاخص عملکرد کلی
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-meuted">
              <span>نرخ تعامل کاربران</span>
              <span>۷۸٪</span>
            </div>
            <div className="h-[6px] rounded-full bg-linear-to-r from-primary to-[#0e7490] mt-1"></div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-meuted">
              <span>تکمیل سفارشات</span>
              <span>۶۳٪</span>
            </div>
            <div className="h-[6px] rounded-full bg-linear-to-r from-[#f59e0b] to-[#b45309] mt-1"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
