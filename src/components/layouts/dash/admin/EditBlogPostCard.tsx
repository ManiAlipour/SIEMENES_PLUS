"use client";

import { useState } from "react";
import { FiX, FiLink, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import BlogRichEditor, {
  extractEmbeddedProductsFromHtml,
} from "@/components/admin/BlogRichEditor";

const inputBase =
  "w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-400 disabled:opacity-70 disabled:bg-slate-50";

interface EditBlogPostCardProps {
  post: {
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
  onClose: () => void;
  onEdit: () => void;
}

export default function EditBlogPostCard({
  post,
  onClose,
  onEdit,
}: EditBlogPostCardProps) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug ?? "");
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [content, setContent] = useState(post.content ?? "");
  const [coverImage, setCoverImage] = useState(post.coverImage ?? "");
  const [video, setVideo] = useState(post.video ?? "");
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(post.tags) ? post.tags.join("، ") : "",
  );
  const [status, setStatus] = useState<"draft" | "published">(post.status);
  const [loading, setLoading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

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

  const handleEdit = async (e: React.FormEvent) => {
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
      const res = await fetch(`/api/admin/blog-posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: excerpt.trim().slice(0, 400),
          content,
          coverImage: coverImage.trim(),
          video: video.trim(),
          tags,
          status,
          embeddedProducts,
        }),
      });

      if (res.ok) {
        toast.success("مطلب ویرایش شد");
        onEdit();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err?.error || "خطا در بروزرسانی مطلب");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارتباط با سرور");
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
      aria-labelledby="edit-blog-title"
    >
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl my-8 relative max-h-[95vh] flex flex-col border border-slate-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 sm:px-6 py-4 text-white flex justify-between items-center shadow-md">
          <h2 id="edit-blog-title" className="font-bold text-lg">ویرایش مطلب وبلاگ</h2>
          <button
            type="button"
            className="p-2 rounded-xl hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={onClose}
            aria-label="بستن"
            disabled={loading}
          >
            <FiX size={22} />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <form onSubmit={handleEdit} className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-2">
                اطلاعات اصلی
              </h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">عنوان *</label>
                <input
                  type="text"
                  className={inputBase}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  maxLength={200}
                  required
                />
                <p className="mt-1 text-xs text-slate-400 text-left">{title.length}/200</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">اسلاگ</label>
                <input
                  type="text"
                  className={inputBase}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={loading}
                  maxLength={220}
                />
                <p className="mt-1 text-xs text-slate-400 text-left">{slug.length}/220</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">خلاصه</label>
                <textarea
                  className={inputBase}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  disabled={loading}
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
                  <label className="cursor-pointer text-sm text-slate-600 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-colors inline-flex items-center gap-2 disabled:opacity-60">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverChange}
                      disabled={coverUploading || loading}
                      className="sr-only"
                    />
                    {coverUploading ? "در حال آپلود..." : "تغییر تصویر"}
                  </label>
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="شاخص"
                      className="w-36 h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">محتوای مطلب</label>
                <BlogRichEditor
                  value={content}
                  onChange={setContent}
                  placeholder="متن مطلب..."
                  minHeight="260px"
                  disabled={loading}
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
                  type="text"
                  className={inputBase}
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  disabled={loading}
                  placeholder="اتوماسیون، PLC، زیمنس"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <FiLink size={14} />
                  لینک ویدیو آپارات (اختیاری)
                </label>
                <input
                  type="text"
                  className={inputBase}
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  disabled={loading}
                  placeholder="https://www.aparat.com/v/..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">وضعیت</label>
                <select
                  className={inputBase}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  disabled={loading}
                >
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشر شده</option>
                </select>
              </div>
            </section>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                onClick={onClose}
                disabled={loading}
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  "ذخیره تغییرات"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
