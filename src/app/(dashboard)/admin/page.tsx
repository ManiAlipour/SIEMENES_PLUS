"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminChartSection from "@/components/layouts/dash/admin/AdminChartSection";
import RecentActionsWidget from "@/components/layouts/dash/admin/RecentActionsWidget";
import { Activity, ArrowDownLeft, ArrowLeft, ArrowUpRight, BookOpenText, Mail, MessageSquareText, Package, RefreshCw, Users, Wrench } from "lucide-react";

type DashboardData = { totalUsers: number; activeUsers: number; totalProducts: number; totalBlogPosts: number; totalPosts: number; totalComments: number; pendingTickets: number; totalTickets: number; newUsersThisMonth: number; newCommentsThisMonth: number; totalCategories: number; pageViewsToday: number; pageViewsThisMonth: number; viewsGrowth: number };
const quickLinks = [
  { href: "/admin/products", label: "افزودن محصول", icon: Package, color: "text-blue-700 bg-blue-50" },
  { href: "/admin/repairs", label: "ثبت تعمیر", icon: Wrench, color: "text-emerald-700 bg-emerald-50" },
  { href: "/admin/blog", label: "نوشتن مقاله", icon: BookOpenText, color: "text-violet-700 bg-violet-50" },
  { href: "/admin/contacts", label: "پیام‌های مشتریان", icon: Mail, color: "text-amber-700 bg-amber-50" },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    try {
      const [statsResponse, analyticsResponse] = await Promise.all([
        fetch("/api/admin/stats", { cache: "no-store" }),
        fetch("/api/admin/analytics", { cache: "no-store" }),
      ]);
      const [stats, analytics] = await Promise.all([statsResponse.json(), analyticsResponse.json()]);
      if (!statsResponse.ok) throw new Error(stats.message || "دریافت آمار انجام نشد.");
      const overview = analytics?.data?.overview || {};
      const trends = analytics?.data?.trendStats || {};
      setData({
        totalUsers: stats.totalUsers ?? 0, activeUsers: stats.activeUsers ?? 0,
        totalProducts: stats.totalProducts ?? 0, totalBlogPosts: stats.totalBlogPosts ?? 0,
        totalPosts: stats.totalPosts ?? 0, totalComments: stats.totalComments ?? 0,
        pendingTickets: stats.pendingTickets ?? 0, totalTickets: stats.totalTickets ?? 0,
        newUsersThisMonth: stats.newUsersThisMonth ?? 0, newCommentsThisMonth: stats.newCommentsThisMonth ?? 0,
        totalCategories: stats.totalCategories ?? 0, pageViewsToday: overview.pageViewsToday ?? 0,
        pageViewsThisMonth: overview.pageViewsThisMonth ?? 0, viewsGrowth: Number.parseFloat(trends.viewsGrowth || "0") || 0,
      });
      setError("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "دریافت اطلاعات داشبورد انجام نشد.";
      setError(message); if (silent) toast.error(message);
    } finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const responseRate = useMemo(() => data?.totalTickets ? Math.round(((data.totalTickets - data.pendingTickets) / data.totalTickets) * 100) : 0, [data]);
  const metrics = [
    { title: "محصولات فروشگاه", value: data?.totalProducts ?? 0, detail: `${(data?.totalCategories ?? 0).toLocaleString("fa-IR")} دسته‌بندی فعال`, icon: Package, color: "blue" },
    { title: "مقاله‌های وبلاگ", value: data?.totalBlogPosts ?? 0, detail: `${(data?.totalPosts ?? 0).toLocaleString("fa-IR")} ویدیوی منتشرشده`, icon: BookOpenText, color: "violet" },
    { title: "کاربران", value: data?.totalUsers ?? 0, detail: `${(data?.newUsersThisMonth ?? 0).toLocaleString("fa-IR")} کاربر تازه این ماه`, icon: Users, color: "emerald" },
    { title: "پیام‌های پاسخ‌نداده", value: data?.pendingTickets ?? 0, detail: `${(data?.totalTickets ?? 0).toLocaleString("fa-IR")} پیام دریافتی`, icon: Mail, color: "amber" },
  ] as const;

  return <div dir="rtl" className="mx-auto max-w-[1440px] space-y-6">
    <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-l from-[#0c3564] via-[#0b2b50] to-[#071b36] px-5 py-6 text-white shadow-xl shadow-blue-950/10 sm:px-8 sm:py-8">
      <div className="absolute -left-14 -top-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-5"><div><span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-blue-100"><Activity size={13} className="text-emerald-300" /> مرکز فرمان سایت</span><h2 className="mt-4 text-2xl font-black sm:text-3xl">خوش آمدید 👋</h2><p className="mt-1.5 max-w-xl text-xs leading-6 text-blue-100/75 sm:text-sm">وضعیت فروشگاه، محتوا و ارتباط با مشتریان را از اینجا مدیریت کنید.</p></div><button type="button" onClick={() => void load(true)} disabled={refreshing} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-bold text-white transition hover:bg-white/15 disabled:opacity-60"><RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> بروزرسانی آمار</button></div>
    </section>

    {error && !data && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><span>{error}</span><button type="button" onClick={() => void load()} className="rounded-lg bg-white px-3 py-2 text-xs font-bold">تلاش دوباره</button></div>}

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ title, value, detail, icon: Icon, color }) => <MetricCard key={title} title={title} value={value} detail={detail} icon={<Icon size={19} />} color={color} loading={loading} />)}
    </section>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.8fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-base font-black text-slate-900">نمای کلی بازدیدها</h2><p className="mt-1 text-xs text-slate-500">رفتار بازدیدکنندگان در سایت</p></div><Link href="/admin/stats" className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">گزارش کامل <ArrowLeft size={14} /></Link></div><div className="grid gap-3 sm:grid-cols-3"><MiniMetric label="بازدید امروز" value={data?.pageViewsToday ?? 0} /><MiniMetric label="بازدید این ماه" value={data?.pageViewsThisMonth ?? 0} /><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">تغییر نسبت به ماه قبل</p><p className={`mt-1 flex items-center gap-1 text-lg font-black ${data?.viewsGrowth && data.viewsGrowth < 0 ? "text-rose-600" : "text-emerald-700"}`}>{data?.viewsGrowth && data.viewsGrowth < 0 ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}{Math.abs(data?.viewsGrowth ?? 0).toLocaleString("fa-IR")}٪</p></div></div><div className="mt-6"><AdminChartSection /></div></section>

      <div className="space-y-5"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-black text-slate-900">دسترسی سریع</h2><p className="mt-1 text-[11px] text-slate-500">کارهای پرتکرار</p></div><ArrowUpRight size={17} className="text-slate-300" /></div><div className="grid grid-cols-2 gap-2">{quickLinks.map(({ href, label, icon: Icon, color }) => <Link key={href} href={href} className="group rounded-xl border border-slate-100 p-3 transition hover:border-blue-100 hover:bg-blue-50/40"><span className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}><Icon size={17} /></span><span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-800">{label}</span></Link>)}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-black text-slate-900">پاسخ‌گویی به پیام‌ها</h2><p className="mt-1 text-[11px] text-slate-500">درصد پیام‌های پاسخ‌داده‌شده</p></div><MessageSquareText size={18} className="text-blue-600" /></div><div className="mt-5 flex items-end justify-between"><span className="text-3xl font-black tabular-nums text-slate-900">{responseRate.toLocaleString("fa-IR")}٪</span><span className="text-[11px] text-slate-500">{(data?.pendingTickets ?? 0).toLocaleString("fa-IR")} پیام در انتظار</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-teal-400 transition-all" style={{ width: `${responseRate}%` }} /></div><Link href="/admin/contacts" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-700">مدیریت پیام‌ها <ArrowLeft size={14} /></Link></section></div>
    </div>

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><RecentActionsWidget /></section>
  </div>;
}

function MetricCard({ title, value, detail, icon, color, loading }: { title: string; value: number; detail: string; icon: React.ReactNode; color: "blue" | "violet" | "emerald" | "amber"; loading: boolean }) {
  const themes = { blue: "bg-blue-50 text-blue-700", violet: "bg-violet-50 text-violet-700", emerald: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" };
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${themes[color]}`}>{icon}</span><span className="rounded-lg bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-400">کل</span></div><p className="mt-5 text-xs font-semibold text-slate-500">{title}</p>{loading ? <div className="mt-1 h-8 w-20 animate-pulse rounded-lg bg-slate-100" /> : <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{value.toLocaleString("fa-IR")}</p>}<p className="mt-2 text-[10px] text-slate-400">{detail}</p></article>;
}

function MiniMetric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">{label}</p><p className="mt-1 text-lg font-black tabular-nums text-slate-900">{value.toLocaleString("fa-IR")}</p></div>; }
