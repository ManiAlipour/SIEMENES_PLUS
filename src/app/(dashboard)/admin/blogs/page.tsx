"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Clapperboard, ExternalLink, Film, LoaderCircle, Plus, RefreshCw, Search, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeading from "@/components/layouts/dash/admin/AdminPageHeading";
import AddBlogModal from "@/components/layouts/dash/admin/AddBlogModal";
import EditBlogCard from "@/components/layouts/dash/admin/EditBlogCard";
import DeleteBlogConfirmModal from "@/components/layouts/dash/admin/DeleteBlogConfirmModal";

interface VideoPost { _id: string; title: string; video: string; status: "draft" | "published"; createdAt: string }
type StatusFilter = "all" | "published" | "draft";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<VideoPost | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<VideoPost | null>(null);

  const fetchBlogs = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    try {
      const response = await fetch("/api/blogs", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "دریافت فهرست ویدیوها انجام نشد.");
      setBlogs(result.data || []);
    } catch (error) { toast.error(error instanceof Error ? error.message : "خطا در دریافت ویدیوها"); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { void fetchBlogs(); }, [fetchBlogs]);
  const counts = useMemo(() => ({ all: blogs.length, published: blogs.filter((blog) => blog.status === "published").length, draft: blogs.filter((blog) => blog.status === "draft").length }), [blogs]);
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa-IR");
    return blogs.filter((blog) => (filter === "all" || blog.status === filter) && (!query || `${blog.title} ${blog.video}`.toLocaleLowerCase("fa-IR").includes(query)));
  }, [blogs, search, filter]);

  return <main dir="rtl" className="mx-auto max-w-[1440px] space-y-5">
    <AdminPageHeading title="ویدیوهای آموزشی" description="ویدیوهای معرفی و آموزش را با لینک آپارات مدیریت و منتشر کنید." icon={Clapperboard} eyebrow="مدیریت محتوا" actions={<><button type="button" onClick={() => void fetchBlogs(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"><RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />به‌روزرسانی</button><button type="button" onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800"><Plus size={15} />ویدیوی جدید</button></>} />

    <section className="grid gap-3 sm:grid-cols-3">
      <VideoMetric title="همه ویدیوها" value={counts.all} tone="blue" />
      <VideoMetric title="منتشرشده" value={counts.published} tone="green" />
      <VideoMetric title="پیش‌نویس" value={counts.draft} tone="amber" />
    </section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-400 focus-within:border-blue-400 focus-within:bg-white sm:max-w-sm"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجو در عنوان یا لینک..." className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400" /></label>
        <div className="flex rounded-xl bg-slate-100 p-1">{([["all", "همه"], ["published", "منتشرشده"], ["draft", "پیش‌نویس"]] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${filter === value ? "bg-white text-blue-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}<span className="mr-1 text-[10px] opacity-60">{counts[value].toLocaleString("fa-IR")}</span></button>)}</div>
      </div>

      {loading ? <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={17} className="animate-spin" />در حال دریافت ویدیوها...</div>
        : filtered.length === 0 ? <div className="flex flex-col items-center px-5 py-14 text-center"><Film size={28} className="text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-600">{blogs.length ? "ویدیویی با این فیلتر پیدا نشد." : "هنوز ویدیویی ثبت نشده است."}</p>{blogs.length === 0 && <button type="button" onClick={() => setCreateOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white"><Plus size={14} />افزودن ویدیو</button>}</div>
        : <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-3">{filtered.map((blog) => <article key={blog._id} className="flex min-w-0 flex-col rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Film size={18} /></span><div className="min-w-0"><h2 className="truncate text-sm font-extrabold text-slate-800">{blog.title}</h2><p className="mt-1 text-[10px] text-slate-400">{new Date(blog.createdAt).toLocaleDateString("fa-IR")}</p></div></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${blog.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{blog.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span></div><a href={blog.video} target="_blank" rel="noopener noreferrer" dir="ltr" className="mt-4 flex min-w-0 items-center gap-1.5 truncate rounded-lg bg-slate-50 px-3 py-2 text-left text-[11px] text-blue-700 hover:bg-blue-50"><ExternalLink size={13} className="shrink-0" /><span className="truncate">{blog.video}</span></a><div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3"><button type="button" onClick={() => setEditBlog(blog)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50"><Pencil size={13} />ویرایش</button><button type="button" onClick={() => setDeleteBlog(blog)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 px-3 py-2 text-[11px] font-bold text-rose-600 hover:bg-rose-50"><Trash2 size={13} />حذف</button></div></article>)}</div>}
    </section>

    {createOpen && <AddBlogModal onClose={() => setCreateOpen(false)} onAdd={() => void fetchBlogs(true)} />}
    {editBlog && <EditBlogCard blog={editBlog} onClose={() => setEditBlog(null)} onEdit={() => { setEditBlog(null); void fetchBlogs(true); }} />}
    {deleteBlog && <DeleteBlogConfirmModal blogId={deleteBlog._id} blogTitle={deleteBlog.title} onClose={() => setDeleteBlog(null)} onDeleted={() => { setBlogs((items) => items.filter((item) => item._id !== deleteBlog._id)); setDeleteBlog(null); }} />}
  </main>;
}

function VideoMetric({ title, value, tone }: { title: string; value: number; tone: "blue" | "green" | "amber" }) {
  const colors = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" };
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[11px] text-slate-500">{title}</p><p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{value.toLocaleString("fa-IR")}</p><span className={`mt-3 inline-block h-1.5 w-10 rounded-full ${colors[tone].split(" ")[0]}`} /></article>;
}
