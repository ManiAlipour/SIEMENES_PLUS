"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler, Legend);

export default function AdminStatPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(({ data }) => setData(data))
      .catch((e) => console.error(e));
  }, []);

  if (!data) return <div className="p-6 text-center text-slate-600">در حال بارگذاری...</div>;

  return (
    <div className="p-6 font-vazirmatn space-y-8 animate-fadeIn">
      {/* ===== Header ===== */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">داشبورد آمار</h1>
        <p className="text-sm text-white/80">نگاه جامع به عملکرد سامانه</p>
      </div>

      {/* ===== Line Chart – Monthly Views ===== */}
      <ChartCard title="بازدیدهای ماهانه" gradient="from-cyan-100 to-cyan-50">
        <BeautifulLineChart dataPoints={data.monthlyViews} />
      </ChartCard>

      {/* ===== Dual Line Chart – Product vs Search ===== */}
      <ChartCard title="مقایسه بازدید محصول و جستجوها" gradient="from-amber-50 to-white">
        <DualLineChart
          products={data.monthlyViews.map((m: any) => m.views * 0.8)}
          searches={data.monthlyViews.map((m: any) => m.views * 0.6)}
          labels={data.monthlyViews.map((m: any) => m.month)}
        />
      </ChartCard>

      {/* ===== Mini Charts (Active Users + Interactions) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="کاربران فعال روزانه" gradient="from-cyan-50 via-white to-white">
          <MiniAreaChart data={data.monthlyViews.map((v: any) => v.views * 0.3)} />
        </ChartCard>

        <ChartCard title="نمودار تعاملات" gradient="from-blue-50 to-white">
          <SparklineChart data={data.monthlyViews.map((v: any) => v.views * 0.15)} />
        </ChartCard>
      </div>
    </div>
  );
}

/* ============ ChartCard Base ============ */
function ChartCard({ title, gradient, children }: { title: string; gradient: string; children: React.ReactNode }) {
  return (
    <div
      className={`bg-gradient-to-b ${gradient} p-6 rounded-2xl border border-slate-200/60 backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 hover:scale-[0.99]`}
    >
      <h2 className="text-sm font-semibold mb-4 text-slate-700">{title}</h2>
      {children}
    </div>
  );
}

/* ============ Main Line Chart ============ */
function BeautifulLineChart({ dataPoints }: { dataPoints: any[] }) {
  const chartData = {
    labels: dataPoints.map((m) => m.month),
    datasets: [
      {
        label: "بازدیدها",
        data: dataPoints.map((m) => m.views),
        fill: true,
        borderColor: "#06b6d4",
        backgroundColor: (ctx: any) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          g.addColorStop(0, "rgba(6,182,212,0.35)");
          g.addColorStop(1, "rgba(255,255,255,0)");
          return g;
        },
        pointBackgroundColor: "#06b6d4",
        pointHoverBackgroundColor: "#ffffff",
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: { legend: { display: false } },
    animation: { duration: 1200, easing: "easeInOutCubic" as const },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: "#94a3b8" } },
    },
  };

  return <Line data={chartData} options={options} height={100} />;
}

/* ============ Dual Line Chart ============ */
function DualLineChart({
  products,
  searches,
  labels,
}: {
  products: number[];
  searches: number[];
  labels: string[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "محصولات",
        data: products,
        borderColor: "#06b6d4",
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "جستجوها",
        data: searches,
        borderColor: "#fbbf24",
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { line: { borderWidth: 2 } },
  };

  return <Line data={data} options={options} height={70} />;
}

/* ============ Mini Area Chart ============ */
function MiniAreaChart({ data }: { data: number[] }) {
  const dataset = {
    labels: data.map((_: any, i: number) => i + 1),
    datasets: [
      {
        data,
        fill: true,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6,182,212,0.15)",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false } },
  };

  return <Line data={dataset} options={options} height={70} />;
}

/* ============ Sparkline Chart ============ */
function SparklineChart({ data }: { data: number[] }) {
  const dataset = {
    labels: data.map((_: any, i: number) => i + 1),
    datasets: [
      {
        data,
        borderColor: "#0ea5e9",
        backgroundColor: "transparent",
        tension: 0.45,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { duration: 800, easing: "easeOutCubic" as const },
  };

  return <Line data={dataset} options={options} height={60} />;
}
