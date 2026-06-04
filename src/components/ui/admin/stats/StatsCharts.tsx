"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut, Pie, Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export type MonthlyView = {
  month: string;
  views: number;
};

export type DailyViewPoint = {
  day: string;
  date: string;
  views: number;
};

export type DailyEngagementPoint = {
  day: string;
  date: string;
  pageViews: number;
  productViews: number;
  comments: number;
  searches: number;
};

export type MixSlice = {
  label: string;
  value: number;
};

export type MultiSeries = {
  label: string;
  data: MonthlyView[];
  color: string;
  bgColor?: string;
};

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const legendOptions = {
  display: true,
  position: "bottom" as const,
  labels: {
    color: "#6b7280",
    font: { size: 11 },
    boxWidth: 10,
    padding: 14,
  },
};

function tooltipLabel(valueLabel: string) {
  return (item: { raw: unknown }) =>
    `${valueLabel}: ${formatFa(Number(item.raw))}`;
}

export const formatFa = (v: number) => v.toLocaleString("fa-IR");

const baseLineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  animation: {
    duration: 800,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#111827",
      padding: 12,
      cornerRadius: 8,
      titleColor: "#fff",
      bodyColor: "#e5e7eb",
      callbacks: {
        title: (items) => items[0].label ?? "",
        label: (item) => `بازدید: ${formatFa(Number(item.raw))}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#6b7280",
      },
    },
    y: {
      grid: {
        color: "rgba(0,0,0,0.05)",
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
        callback: (v) => formatFa(Number(v)),
      },
    },
  },
};

const baseBarOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  animation: {
    duration: 800,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#111827",
      padding: 12,
      cornerRadius: 8,
      titleColor: "#fff",
      bodyColor: "#e5e7eb",
      callbacks: {
        title: (items) => items[0].label ?? "",
        label: (item) => `بازدید: ${formatFa(Number(item.raw))}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#6b7280",
      },
    },
    y: {
      grid: {
        color: "rgba(0,0,0,0.05)",
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
        callback: (v) => formatFa(Number(v)),
      },
    },
  },
};

export function BeautifulLineChart({ data }: { data: MonthlyView[] }) {
  return (
    <Line
      options={baseLineOptions}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: data.map((d) => d.views),
            borderColor: "#3b82f6",
            borderWidth: 3,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
              g.addColorStop(0, "rgba(59,130,246,0.25)");
              g.addColorStop(1, "rgba(59,130,246,0)");
              return g;
            },
          },
        ],
      }}
    />
  );
}

export function DualLineChart({ data }: { data: MonthlyView[] }) {
  return (
    <Line
      options={baseLineOptions}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "امسال",
            data: data.map((d) => d.views),
            borderColor: "#22c55e",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: "سال قبل",
            data: data.map((d) => Math.floor(d.views * 0.7)),
            borderColor: "#94a3b8",
            borderDash: [6, 4],
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      }}
    />
  );
}

export function BarChart({ data }: { data: MonthlyView[] }) {
  return (
    <Bar
      options={baseBarOptions}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: data.map((d) => d.views),
            backgroundColor: "#6366f1",
            hoverBackgroundColor: "#4f46e5",
            borderRadius: 10,
            barThickness: 22,
          },
        ],
      }}
    />
  );
}

export function DailyViewsChart({ data }: { data: DailyViewPoint[] }) {
  return (
    <Bar
      options={baseBarOptions}
      data={{
        labels: data.map((d) => d.day),
        datasets: [
          {
            data: data.map((d) => d.views),
            backgroundColor: "#06b6d4",
            hoverBackgroundColor: "#0891b2",
            borderRadius: 8,
            barThickness: 28,
          },
        ],
      }}
    />
  );
}

export function DonutChart({ data }: { data: MonthlyView[] }) {
  const total = data.reduce((sum, item) => sum + item.views, 0);

  const donutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 10,
        cornerRadius: 8,
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        callbacks: {
          label: (item) => {
            const value = Number(item.raw);
            const percent = total > 0 ? Math.round((value / total) * 100) : 0;
            return ` ${item.label}: ${formatFa(value)} (${formatFa(percent)}٪)`;
          },
        },
      },
    },
  };

  return (
    <Doughnut
      options={donutOptions}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: data.map((d) => d.views),
            backgroundColor: CHART_COLORS,
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      }}
    />
  );
}

/** چند خط — مقایسه چند معیار در طول ماه‌ها */
export function MultiLineChart({ series }: { series: MultiSeries[] }) {
  const labels = series[0]?.data.map((d) => d.month) ?? [];
  const options: ChartOptions<"line"> = {
    ...baseLineOptions,
    plugins: {
      ...baseLineOptions.plugins,
      legend: legendOptions,
      tooltip: {
        ...baseLineOptions.plugins?.tooltip,
        callbacks: {
          label: (item) => {
            const name = series[item.datasetIndex]?.label ?? "";
            return `${name}: ${formatFa(Number(item.raw))}`;
          },
        },
      },
    },
  };

  return (
    <Line
      options={options}
      data={{
        labels,
        datasets: series.map((s) => ({
          label: s.label,
          data: s.data.map((d) => d.views),
          borderColor: s.color,
          backgroundColor: s.bgColor ?? `${s.color}22`,
          borderWidth: 2.5,
          pointRadius: 2,
          tension: 0.35,
          fill: false,
        })),
      }}
    />
  );
}

/** میله‌ای stacked — تجمیع چند نوع فعالیت */
export function StackedBarChart({ series }: { series: MultiSeries[] }) {
  const labels = series[0]?.data.map((d) => d.month) ?? [];
  const options: ChartOptions<"bar"> = {
    ...baseBarOptions,
    plugins: {
      ...baseBarOptions.plugins,
      legend: legendOptions,
      tooltip: {
        ...baseBarOptions.plugins?.tooltip,
        callbacks: {
          label: (item) => {
            const name = series[item.datasetIndex]?.label ?? "";
            return `${name}: ${formatFa(Number(item.raw))}`;
          },
        },
      },
    },
    scales: {
      ...baseBarOptions.scales,
      x: { ...baseBarOptions.scales?.x, stacked: true },
      y: { ...baseBarOptions.scales?.y, stacked: true },
    },
  };

  return (
    <Bar
      options={options}
      data={{
        labels,
        datasets: series.map((s, i) => ({
          label: s.label,
          data: s.data.map((d) => d.views),
          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
          borderRadius: 4,
          barThickness: 18,
        })),
      }}
    />
  );
}

/** ترکیب میله + خط — دو محور Y */
export function MixedBarLineChart({
  labels,
  barData,
  barLabel,
  lineData,
  lineLabel,
  barColor = "#6366f1",
  lineColor = "#f59e0b",
}: {
  labels: string[];
  barData: number[];
  barLabel: string;
  lineData: number[];
  lineLabel: string;
  barColor?: string;
  lineColor?: string;
}) {
  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: legendOptions,
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (item) =>
            `${item.dataset.label}: ${formatFa(Number(item.raw))}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6b7280" } },
      y: {
        position: "left",
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#6b7280", callback: (v) => formatFa(Number(v)) },
      },
      y1: {
        position: "right",
        grid: { drawOnChartArea: false },
        ticks: { color: lineColor, callback: (v) => formatFa(Number(v)) },
      },
    },
  };

  return (
    <Chart
      type="bar"
      options={options}
      data={{
        labels,
        datasets: [
          {
            type: "bar" as const,
            label: barLabel,
            data: barData,
            backgroundColor: barColor,
            borderRadius: 8,
            yAxisID: "y",
          },
          {
            type: "line" as const,
            label: lineLabel,
            data: lineData,
            borderColor: lineColor,
            backgroundColor: `${lineColor}33`,
            borderWidth: 2.5,
            pointRadius: 3,
            tension: 0.35,
            fill: true,
            yAxisID: "y1",
          },
        ],
      }}
    />
  );
}

/** میله افقی — مناسب رتبه‌بندی */
export function HorizontalBarChart({
  labels,
  values,
  color = "#06b6d4",
}: {
  labels: string[];
  values: number[];
  color?: string;
}) {
  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        padding: 10,
        cornerRadius: 8,
        callbacks: { label: tooltipLabel("تعداد") },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#6b7280", callback: (v) => formatFa(Number(v)) },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 11 } },
      },
    },
  };

  return (
    <Bar
      options={options}
      data={{
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: color,
            hoverBackgroundColor: color,
            borderRadius: 6,
            barThickness: 16,
          },
        ],
      }}
    />
  );
}

/** نمودار دایره‌ای — توزیع محتوا یا تعامل */
export function MixPieChart({ slices }: { slices: MixSlice[] }) {
  const total = slices.reduce((s, i) => s + i.value, 0);
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        ...legendOptions,
        position: "right",
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (item) => {
            const value = Number(item.raw);
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return ` ${item.label}: ${formatFa(value)} (${formatFa(pct)}٪)`;
          },
        },
      },
    },
  };

  return (
    <Pie
      options={options}
      data={{
        labels: slices.map((s) => s.label),
        datasets: [
          {
            data: slices.map((s) => s.value),
            backgroundColor: CHART_COLORS,
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      }}
    />
  );
}

/** فعالیت روزانه چندمعیاره */
export function DailyEngagementChart({
  data,
}: {
  data: DailyEngagementPoint[];
}) {
  const options: ChartOptions<"line"> = {
    ...baseLineOptions,
    plugins: {
      ...baseLineOptions.plugins,
      legend: legendOptions,
      tooltip: {
        ...baseLineOptions.plugins?.tooltip,
        callbacks: {
          label: (item) => {
            const names = ["بازدید صفحه", "بازدید محصول", "نظر", "جستجو"];
            return `${names[item.datasetIndex] ?? ""}: ${formatFa(Number(item.raw))}`;
          },
        },
      },
    },
  };

  return (
    <Line
      options={options}
      data={{
        labels: data.map((d) => d.day),
        datasets: [
          {
            label: "بازدید صفحه",
            data: data.map((d) => d.pageViews),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.12)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
          {
            label: "بازدید محصول",
            data: data.map((d) => d.productViews),
            borderColor: "#10b981",
            tension: 0.35,
            pointRadius: 3,
          },
          {
            label: "نظر",
            data: data.map((d) => d.comments),
            borderColor: "#8b5cf6",
            tension: 0.35,
            pointRadius: 3,
          },
          {
            label: "جستجو",
            data: data.map((d) => d.searches),
            borderColor: "#f59e0b",
            tension: 0.35,
            pointRadius: 3,
          },
        ],
      }}
    />
  );
}

/** area chart — ثبت‌نام کاربران */
export function AreaChart({
  data,
  color = "#6366f1",
  label = "تعداد",
}: {
  data: MonthlyView[];
  color?: string;
  label?: string;
}) {
  const options: ChartOptions<"line"> = {
    ...baseLineOptions,
    plugins: {
      ...baseLineOptions.plugins,
      tooltip: {
        ...baseLineOptions.plugins?.tooltip,
        callbacks: { label: tooltipLabel(label) },
      },
    },
  };

  return (
    <Line
      options={options}
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: data.map((d) => d.views),
            borderColor: color,
            borderWidth: 2.5,
            pointRadius: 2,
            tension: 0.4,
            fill: true,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
              g.addColorStop(0, `${color}44`);
              g.addColorStop(1, `${color}05`);
              return g;
            },
          },
        ],
      }}
    />
  );
}

