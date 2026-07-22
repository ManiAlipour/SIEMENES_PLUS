"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = {
  month: string;
  views: number;
  comments: number;
  searches: number;
  users: number;
};

export default function AdminChartSection() {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!json?.data) return;
        const d = json.data;
        const months = d.monthlyViews?.map((m: { month: string }) => m.month) ?? [];
        setData(
          months.map((month: string, i: number) => ({
            month,
            views: d.monthlyViews?.[i]?.views ?? 0,
            comments: d.monthlyComments?.[i]?.views ?? 0,
            searches: d.monthlySearches?.[i]?.views ?? 0,
            users: d.monthlyUsers?.[i]?.views ?? 0,
          })),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="admin-card animate-pulse p-6">
        <div className="mb-4 h-6 w-40 rounded bg-[#eef3f8]" />
        <div className="h-[300px] rounded bg-[#f8fafc]" />
      </section>
    );
  }

  if (!data.length) return null;

  return (
    <section className="admin-card p-6">
      <h2 className="mb-1 text-base font-bold text-[#0b1f33]">
        نمودارهای ترکیبی ماهانه
      </h2>
      <p className="mb-6 text-xs text-[#64748b]">
        بازدید، نظرات، جستجو و ثبت‌نام کاربران
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">خطی — چند معیار</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={false} name="بازدید" />
              <Line type="monotone" dataKey="comments" stroke="#8b5cf6" strokeWidth={2} dot={false} name="نظر" />
              <Line type="monotone" dataKey="searches" stroke="#f59e0b" strokeWidth={2} dot={false} name="جستجو" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">میله‌ای — کاربران و نظرات</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#6366f1" name="کاربر جدید" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="#10b981" name="نظر" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
