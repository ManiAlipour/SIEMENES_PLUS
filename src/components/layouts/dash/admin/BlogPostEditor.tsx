"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import BlogRichEditor from "@/components/admin/blogRichEditor/BlogRichEditor";
import { extractEmbeddedProductsFromHtml, sanitizeHtml } from "@/components/admin/blogRichEditor/utils";
import { ArrowUpRight, Check, FileText, ImagePlus, Link2, LoaderCircle, Save, X } from "lucide-react";

export type BlogPostEditorData = {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  video?: string;
  tags?: string[];
  status: "draft" | "published";
};

type Props = { post?: BlogPostEditorData; onClose: () => void; onSaved: () => void };
const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50";

export default function BlogPostEditor({ post, onClose, onSaved }: Props) {
  const editing = Boolean(post);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [video, setVideo] = useState(post?.video ?? "");
  const [tagsInput, setTagsInput] = useState(post?.tags?.join("، ") ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState<"draft" | "published" | null>(null);
  const [uploading, setUploading] = useState(false);
  const wordCount = useMemo(() => content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length, [content]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && !saving && !uploading) onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose, saving, uploading]);

  async function uploadCover(file?: File) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("تصویر باید JPG، PNG یا WebP و حداکثر ۵ مگابایت باشد.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData(); form.append("file", file);
      const response = await fetch("/api/admin/upload/blog-image", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "بارگذاری تصویر انجام نشد.");
      setCoverImage(result.url);
      toast.success("تصویر شاخص بارگذاری شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ارتباط با سرور برقرار نشد.");
    } finally { setUploading(false); }
  }

  async function save(nextStatus: "draft" | "published") {
    if (!title.trim()) { toast.error("عنوان مقاله را وارد کنید."); return; }
    if (nextStatus === "published" && !sanitizeHtml(content).replace(/<[^>]+>/g, "").trim()) {
      toast.error("برای انتشار، محتوای مقاله را بنویسید."); return;
    }
    if (video.trim() && !/^https?:\/\/(www\.)?aparat\.com\/.+/i.test(video.trim())) {
      toast.error("لینک ویدیو باید از آپارات باشد."); return;
    }
    const cleanContent = sanitizeHtml(content);
    const embeddedProducts = extractEmbeddedProductsFromHtml(cleanContent).map((item) => ({ productId: item.productId, slug: item.slug, blockId: item.blockId }));
    const tags = tagsInput.split(/[،,]/).map((tag) => tag.trim()).filter(Boolean);
    setSaving(true);
    setSavingStatus(nextStatus);
    try {
      const response = await fetch(editing ? `/api/admin/blog-posts/${post!._id}` : "/api/admin/blog-posts", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), slug: slug.trim() || undefined, excerpt: excerpt.trim().slice(0, 400), content: cleanContent, coverImage: coverImage.trim(), images: post ? undefined : [], video: video.trim(), tags, status: nextStatus, embeddedProducts }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || result.message || "ذخیره مقاله انجام نشد.");
      setStatus(nextStatus);
      toast.success(nextStatus === "published" ? "مقاله منتشر شد." : editing ? "تغییرات ذخیره شد." : "پیش‌نویس ذخیره شد.");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ارتباط با سرور برقرار نشد.");
    } finally { setSaving(false); setSavingStatus(null); }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving && !uploading) onClose(); }} role="dialog" aria-modal="true" aria-labelledby="blog-editor-title">
    <section dir="rtl" className="flex h-[min(96vh,940px)] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-[#f5f7fb] shadow-2xl shadow-slate-950/30 sm:rounded-[1.75rem]">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0b2545] px-4 py-3.5 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200"><FileText size={19} /></span><div className="min-w-0"><div className="flex items-center gap-2"><h2 id="blog-editor-title" className="truncate text-sm font-extrabold sm:text-base">{editing ? "ویرایش مقاله" : "نوشتن مقاله جدید"}</h2><span className={`hidden rounded-full px-2 py-1 text-[10px] font-bold sm:inline-flex ${status === "published" ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-300/15 text-amber-200"}`}>{status === "published" ? "منتشرشده" : "پیش‌نویس"}</span></div><p className="mt-0.5 hidden text-[11px] text-blue-100/60 sm:block">عنوان، محتوا و تنظیمات انتشار را در یک جا مدیریت کنید.</p></div></div>
        <button type="button" onClick={onClose} disabled={saving || uploading} aria-label="بستن ویرایشگر" className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"><X size={20} /></button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-5">
          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2"><span className="h-5 w-1 rounded-full bg-blue-600" /><h3 className="text-sm font-extrabold text-slate-900">اطلاعات مقاله</h3></div>
              <label className="mb-2 block text-xs font-bold text-slate-600" htmlFor="post-title">عنوان مقاله <span className="text-rose-500">*</span></label>
              <input id="post-title" className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="مثلاً راهنمای انتخاب درایو مناسب" maxLength={200} autoFocus />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>عنوان روشن و قابل جست‌وجو بنویسید.</span><span>{title.length.toLocaleString("fa-IR")} / ۲۰۰</span></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><label className="mb-2 block text-xs font-bold text-slate-600" htmlFor="post-slug">نشانی مقاله (Slug)</label><input id="post-slug" dir="ltr" className={`${fieldClass} text-left font-mono text-xs`} value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="siemens-drive-guide" maxLength={220} /><p className="mt-1 text-[10px] text-slate-400">در صورت خالی‌بودن، خودکار ساخته می‌شود.</p></div>
                <div><label className="mb-2 block text-xs font-bold text-slate-600" htmlFor="post-excerpt">خلاصه مقاله</label><textarea id="post-excerpt" className={`${fieldClass} resize-none leading-6`} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="خلاصه‌ای کوتاه برای کارت مقاله و نتایج جست‌وجو" rows={3} maxLength={400} /><p className="mt-1 text-left text-[10px] text-slate-400">{excerpt.length.toLocaleString("fa-IR")} / ۴۰۰</p></div>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6"><div><h3 className="text-sm font-extrabold text-slate-900">متن مقاله</h3><p className="mt-1 text-[11px] text-slate-400">برای ساختاردهی از تیترها، فهرست، جدول و تصویر استفاده کنید.</p></div><span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-500">{wordCount.toLocaleString("fa-IR")} واژه</span></div>
              <div className="p-2 sm:p-4"><BlogRichEditor value={content} onChange={setContent} placeholder="نوشتن مقاله را از اینجا شروع کنید…" minHeight="430px" /></div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-extrabold">تصویر شاخص</h3><p className="mt-1 text-[11px] text-slate-400">JPG، PNG یا WebP · حداکثر ۵ مگابایت</p></div><ImagePlus size={19} className="text-blue-600" /></div>
              {coverImage ? <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"><img src={coverImage} alt="پیش‌نمایش تصویر شاخص" className="aspect-[16/10] w-full object-cover" /><button type="button" onClick={() => setCoverImage("")} className="absolute left-2 top-2 rounded-lg bg-slate-950/65 px-2.5 py-1.5 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">حذف تصویر</button></div> : <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-blue-300 hover:bg-blue-50/50"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">{uploading ? <LoaderCircle size={19} className="animate-spin" /> : <ImagePlus size={19} />}</span><span className="mt-3 text-xs font-bold text-slate-700">{uploading ? "در حال بارگذاری تصویر…" : "انتخاب تصویر شاخص"}</span><span className="mt-1 text-[10px] text-slate-400">برای انتخاب کلیک کنید</span><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { void uploadCover(event.target.files?.[0]); event.target.value = ""; }} /></label>}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h3 className="text-sm font-extrabold">دسته‌بندی محتوا</h3><label htmlFor="post-tags" className="mb-2 mt-4 block text-xs font-bold text-slate-600">برچسب‌ها</label><input id="post-tags" className={fieldClass} value={tagsInput} onChange={(event) => setTagsInput(event.target.value)} placeholder="زیمنس، PLC، اتوماسیون" /><p className="mt-1.5 text-[10px] leading-5 text-slate-400">برچسب‌ها را با ویرگول از هم جدا کنید.</p>
              <label htmlFor="post-video" className="mb-2 mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-600"><Link2 size={14} /> لینک ویدیوی آپارات <span className="font-normal text-slate-400">(اختیاری)</span></label><input id="post-video" dir="ltr" className={`${fieldClass} text-left text-xs`} value={video} onChange={(event) => setVideo(event.target.value)} placeholder="https://www.aparat.com/v/..." />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h3 className="text-sm font-extrabold">وضعیت انتشار</h3><div className="mt-3 space-y-2"><button type="button" onClick={() => setStatus("draft")} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-right transition ${status === "draft" ? "border-amber-300 bg-amber-50" : "border-slate-200 hover:bg-slate-50"}`}><span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${status === "draft" ? "border-amber-500 bg-amber-500 text-white" : "border-slate-300"}`}>{status === "draft" && <Check size={10} />}</span><span><span className="block text-xs font-bold text-slate-800">پیش‌نویس</span><span className="mt-1 block text-[10px] text-slate-500">ذخیره برای ادامه ویرایش در آینده</span></span></button><button type="button" onClick={() => setStatus("published")} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-right transition ${status === "published" ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:bg-slate-50"}`}><span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${status === "published" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}>{status === "published" && <Check size={10} />}</span><span><span className="block text-xs font-bold text-slate-800">انتشار مقاله</span><span className="mt-1 block text-[10px] text-slate-500">نمایش مقاله برای بازدیدکنندگان سایت</span></span></button></div></section>

            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-[11px] leading-6 text-blue-900"><ArrowUpRight size={14} className="ml-1 inline" />محصولات مرتبط را از ابزار درج محصول داخل ویرایشگر اضافه کنید تا به مقاله لینک شوند.</div>
          </aside>
        </div>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
        <button type="button" onClick={onClose} disabled={saving || uploading} className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 disabled:opacity-50">انصراف</button>
        <div className="flex gap-2"><button type="button" onClick={() => void save("draft")} disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">{savingStatus === "draft" ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}ذخیره پیش‌نویس</button><button type="button" onClick={() => void save("published")} disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-50">{savingStatus === "published" ? <LoaderCircle size={15} className="animate-spin" /> : <ArrowUpRight size={15} />}{editing ? "ذخیره و انتشار" : "انتشار مقاله"}</button></div>
      </footer>
    </section>
  </div>;
}
