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
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler
);

export type MonthlyView = {
  month: string;
  views: number;
};

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
            return ` ${item.label}: ${formatFa(value)} بازدید (${formatFa(
              percent
            )}٪)`;
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
            backgroundColor: [
              "#4f46e5",
              "#0ea5e9",
              "#22c55e",
              "#f97316",
              "#e11d48",
              "#8b5cf6",
              "#06b6d4",
              "#84cc16",
              "#facc15",
              "#f97316",
              "#ec4899",
              "#6366f1",
            ],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      }}
    />
  );
}

