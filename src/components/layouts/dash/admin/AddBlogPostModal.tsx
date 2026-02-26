"use client";

import { useEffect, useState } from "react";
import { FiX, FiLink, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { useScrollLock } from "iso-hooks";
import BlogRichEditor, {
  extractEmbeddedProductsFromHtml,
} from "@/components/admin/BlogRichEditor";

const inputBase =
  "w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-400";

interface AddBlogPostModalProps {
  onClose: () => void;
  onAdd: () => void;
}

export default function AddBlogPostModal({
  onClose,
  onAdd,
}: AddBlogPostModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [video, setVideo] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    lock();
    return () => unlock();
  }, [lock, unlock]);

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload/blog-image", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data?.url) setCoverImage(data.url);
      else toast.error(data?.error || "خطا در آپلود تصویر");
    } catch {
      toast.error("خطا در آپلود تصویر");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("عنوان الزامی است");
      return;
    }
    if (video.trim()) {
      const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
      if (!aparatRegex.test(video)) {
        toast.error("لینک ویدیو باید آدرس صحیح از Aparat باشد");
        return;
      }
    }

    const embeddedProducts = extractEmbeddedProductsFromHtml(content).map(
      (p) => ({ productId: p.productId, slug: p.slug, blockId: p.blockId }),
    );
    const tags = tagsInput
      .split(/[،,]/)
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: excerpt.trim().slice(0, 400),
          content,
          coverImage: coverImage.trim(),
          images: [],
          video: video.trim(),
          tags,
          status,
          embeddedProducts,
        }),
      });

      if (res.ok) {
        toast.success("مطلب افزوده شد");
        onAdd();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || "خطا در افزودن مطلب");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-blog-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl mx-auto my-8 rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200/80"
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 sm:px-6 py-4 text-white flex justify-between items-center shadow-md">
          <h2 id="add-blog-title" className="font-bold text-lg">افزودن مطلب وبلاگ</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="p-2 rounded-xl hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="p-4 sm:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-2">
                اطلاعات اصلی
              </h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  عنوان *
                </label>
                <input
                  className={inputBase}
                  placeholder="عنوان مطلب"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-slate-400 text-left">{title.length}/200</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  اسلاگ (اختیاری)
                </label>
                <input
                  className={inputBase}
                  placeholder="slug-post"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  maxLength={220}
                />
                <p className="mt-1 text-xs text-slate-400 text-left">{slug.length}/220</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  خلاصه (برای کارت و سئو)
                </label>
                <textarea
                  className={inputBase}
                  placeholder="یک یا دو جمله خلاصه"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  maxLength={400}
                />
                <p className="mt-1 text-xs text-slate-400 text-left">{excerpt.length}/400</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-2">
                رسانه و محتوا
              </h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                  <FiImage className="text-cyan-600" size={16} />
                  تصویر شاخص
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <label className="cursor-pointer text-sm text-slate-600 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-colors inline-flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverChange}
                      disabled={coverUploading}
                      className="sr-only"
                    />
                    {coverUploading ? "در حال آپلود..." : "انتخاب تصویر"}
                  </label>
                  {coverImage && (
                    <div className="relative">
                      <img
                        src={coverImage}
                        alt="پیش‌نمایش شاخص"
                        className="w-36 h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  محتوای مطلب
                </label>
                <BlogRichEditor
                  value={content}
                  onChange={setContent}
                  placeholder="متن مطلب را بنویسید. می‌توانید تصویر، جدول و محصول درج کنید."
                  minHeight="280px"
                />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-2">
                تنظیمات
              </h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  تگ‌ها (با کاما یا «،» جدا کنید)
                </label>
                <input
                  className={inputBase}
                  placeholder="مثال: اتوماسیون، PLC، زیمنس"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <FiLink className="text-cyan-600" size={14} />
                  لینک ویدیو آپارات (اختیاری)
                </label>
                <input
                  className={inputBase}
                  placeholder="https://www.aparat.com/v/..."
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">وضعیت انتشار</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "draft"}
                      onChange={() => setStatus("draft")}
                      className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500"
                    />
                    <span className="text-slate-700 group-hover:text-slate-900">پیش‌نویس</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "published"}
                      onChange={() => setStatus("published")}
                      className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500"
                    />
                    <span className="text-slate-700 group-hover:text-slate-900">منتشر شود</span>
                  </label>
                </div>
              </div>
            </section>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                انصراف
              </button>
              <button
                disabled={loading}
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  "افزودن مطلب"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
