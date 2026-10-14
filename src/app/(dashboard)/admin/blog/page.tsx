"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowUpRight, CalendarDays, CheckCircle2, Edit3, FileText, Plus, Search, Trash2, XCircle } from "lucide-react";
import AddBlogPostModal from "@/components/layouts/dash/admin/AddBlogPostModal";
import EditBlogPostCard from "@/components/layouts/dash/admin/EditBlogPostCard";
import DeleteBlogPostConfirmModal from "@/components/layouts/dash/admin/DeleteBlogPostConfirmModal";

interface BlogPost { _id: string; title: string; slug?: string | null; excerpt?: string; content?: string; coverImage?: string; video?: string; tags?: string[]; status: "draft" | "published"; createdAt: string }
type Filter = "all" | "published" | "draft";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);

  const fetchPosts = useCallback(async (silent = false) => {
    try {
      if (silent) setRefreshing(true); else setLoading(true);
      const response = await fetch("/api/admin/blog-posts", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "دریافت مقاله‌ها انجام نشد.");
      setPosts(result.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ارتباط با سرور برقرار نشد.");
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { void fetchPosts(); }, [fetchPosts]);
  const counts = useMemo(() => ({ all: posts.length, published: posts.filter((post) => post.status === "published").length, draft: posts.filter((post) => post.status === "draft").length }), [posts]);
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa-IR");
    return posts.filter((post) => (filter === "all" || post.status === filter) && (!query || `${post.title} ${post.slug || ""} ${post.tags?.join(" ") || ""}`.toLocaleLowerCase("fa-IR").includes(query)));
  }, [posts, search, filter]);

  return <div dir="rtl" className="mx-auto max-w-[1440px] space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700"><FileText size={14} /> تحریریه</div><h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">مقاله‌های وبلاگ</h1><p className="mt-2 text-sm text-slate-500">مقاله‌های آموزشی و تخصصی سایت را بنویسید و منتشر کنید.</p></div>
      <div className="flex gap-2"><button type="button" onClick={() => void fetchPosts(true)} disabled={refreshing} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60">{refreshing ? "در حال بروزرسانی…" : "بروزرسانی"}</button><button type="button" onClick={() => setCreateOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800"><Plus size={16} /> مقاله جدید</button></div>
    </header>

    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Metric label="همه مقاله‌ها" value={counts.all} icon={<FileText size={18} />} tone="blue" />
      <Metric label="منتشرشده" value={counts.published} icon={<CheckCircle2 size={18} />} tone="green" />
      <Metric label="پیش‌نویس" value={counts.draft} icon={<XCircle size={18} />} tone="amber" />
    </section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="relative w-full sm:max-w-sm"><Search size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجو در عنوان، نشانی یا برچسب…" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-9 pl-3 text-xs outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10" /></div>
        <div className="flex rounded-xl bg-slate-100 p-1">{([ ["all", "همه"], ["published", "منتشرشده"], ["draft", "پیش‌نویس"] ] as [Filter, string][]).map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${filter === value ? "bg-white text-blue-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}<span className="mr-1.5 text-[10px] opacity-60">{counts[value].toLocaleString("fa-IR")}</span></button>)}</div>
      </div>

      {loading ? <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-52 animate-pulse rounded-xl bg-slate-100" />)}</div>
        : filtered.length ? <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((post) => <article key={post._id} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5">
          <div className="flex gap-3 p-4"><div className="h-[76px] w-[92px] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-slate-100">{post.coverImage ? <img src={post.coverImage} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-blue-300"><FileText size={22} /></div>}</div><div className="min-w-0 flex-1"><div className="mb-2 flex items-center gap-2"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${post.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{post.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span><span className="inline-flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays size={11} />{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span></div><h2 className="line-clamp-2 text-sm font-extrabold leading-6 text-slate-900">{post.title}</h2><p dir="ltr" className="mt-1 truncate text-left font-mono text-[10px] text-slate-400">/{post.slug || "بدون نشانی"}</p></div></div>
          {post.excerpt && <p className="mx-4 line-clamp-2 min-h-10 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">{post.excerpt}</p>}
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-3 py-2"><div className="flex min-w-0 gap-1 overflow-hidden">{post.tags?.slice(0, 2).map((tag) => <span key={tag} className="truncate rounded-md bg-slate-50 px-2 py-1 text-[9px] text-slate-500">{tag}</span>)}</div><div className="flex shrink-0 items-center gap-1">
            {post.status === "published" && post.slug && <Link href={`/blog/${post.slug}`} target="_blank" aria-label="مشاهده مقاله" className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"><ArrowUpRight size={15} /></Link>}
            <button type="button" onClick={() => setEditPost(post)} aria-label="ویرایش مقاله" className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"><Edit3 size={15} /></button>
            <button type="button" onClick={() => setDeletePost(post)} aria-label="حذف مقاله" className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
          </div></div>
        </article>)}</div>
        : <div className="flex flex-col items-center px-5 py-16 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><FileText size={25} /></span><h2 className="mt-4 text-sm font-extrabold text-slate-800">{search || filter !== "all" ? "مقاله‌ای با این مشخصات پیدا نشد" : "هنوز مقاله‌ای ثبت نشده است"}</h2><p className="mt-1 max-w-sm text-xs leading-6 text-slate-500">{search || filter !== "all" ? "عبارت جستجو یا فیلتر را تغییر دهید." : "اولین مقاله‌ی آموزشی سایت را ایجاد کنید."}</p>{!search && filter === "all" && <button type="button" onClick={() => setCreateOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white"><Plus size={15} /> نوشتن مقاله</button>}</div>}
    </section>

    {createOpen && <AddBlogPostModal onClose={() => setCreateOpen(false)} onAdd={() => void fetchPosts(true)} />}
    {editPost && <EditBlogPostCard post={editPost} onClose={() => setEditPost(null)} onEdit={() => void fetchPosts(true)} />}
    {deletePost && <DeleteBlogPostConfirmModal postId={deletePost._id} postTitle={deletePost.title} onClose={() => setDeletePost(null)} onDeleted={() => { setPosts((items) => items.filter((item) => item._id !== deletePost._id)); setDeletePost(null); }} />}
  </div>;
}

function Metric({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "blue" | "green" | "amber" }) {
  const colors = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" };
  return <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[tone]}`}>{icon}</span><div><p className="text-[11px] font-medium text-slate-500">{label}</p><p className="mt-0.5 text-xl font-black tabular-nums text-slate-900">{value.toLocaleString("fa-IR")}</p></div></div>;
}
