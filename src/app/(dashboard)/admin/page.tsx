import AdminChartSection from "@/components/layouts/dash/admin/AdminChartSection";
import AdminLayout from "./layout";
import InfoCard from "@/components/ui/admin/InfoCard";

export default function AdminDashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <InfoCard
          title="کاربران"
          desc="تعداد کاربران فعال"
          count={542}
          color="primary"
        />
        <InfoCard
          title="محصولات"
          desc="تعداد محصولات ثبت شده"
          count={128}
          color="success"
        />
        <InfoCard
          title="سفارشات"
          desc="سفارشات منتظر بررسی"
          count={37}
          color="warn"
        />
        <InfoCard
          title="تیکت‌ها"
          desc="تیکت‌های باز شده"
          count={12}
          color="danger"
        />
      </div>

      {/* بخش نمودار */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-slate-300/20">
        {/* اینجا نمودار Chart.js یا Recharts اضافه میشه */}
        <h2 className="text-lg font-semibold mb-4 text-slate-800">
          آمار ماهانه
        </h2>
      </section>

      <AdminChartSection />
    </>
  );
}
