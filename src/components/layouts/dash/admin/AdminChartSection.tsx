"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { monthlyStats } from "@/lib/mockAdminStats";

export default function AdminChartSection() {
  return (
    <section
      className="mt-8 bg-white/60 backdrop-blur-xl border border-slate-400/10 
                        shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-xl p-6"
    >
      <h2 className="text-lg font-semibold text-meuted mb-4">
        آمار ماهانه سایت
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={monthlyStats}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fill: "#374151" }} />
          <YAxis tick={{ fill: "#374151" }} />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="users"
            stroke="#06b6d4"
            strokeWidth={2.5}
            dot={false}
            name="کاربران"
          />
          <Line
            type="monotone"
            dataKey="products"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            name="محصولات"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={false}
            name="سفارشات"
          />
          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={false}
            name="تیکت‌ها"
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
