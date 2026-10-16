"use client";
import { useState } from "react";
import { FiX, FiLink } from "react-icons/fi";
import toast from "react-hot-toast";

const glass =
  "border border-slate-200 bg-white shadow-2xl shadow-slate-950/20";
const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

interface EditBlogCardProps {
  blog: {
    _id: string;
    title: string;
    video: string;
    status: "draft" | "published";
  };
  onClose: () => void;
  onEdit: () => void;
}

export default function EditBlogCard({
  blog,
  onClose,
  onEdit,
}: EditBlogCardProps) {
  const [title, setTitle] = useState(blog.title);
  const [video, setVideo] = useState(blog.video); // Aparat video link only
  const [status, setStatus] = useState<"draft" | "published">(blog.status);
  const [loading, setLoading] = useState(false);

  // --- Submit Blog Edit ---
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("عنوان الزامی است");
      return;
    }
    if (!video.trim()) {
      toast.error("لینک آپارات الزامی است");
      return;
    }
    // Regex validation (client-side)
    const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
    if (!aparatRegex.test(video)) {
      toast.error("لینک ویدیو باید آدرس صحیح از Aparat باشد");
      return;
    }

    try {
      setLoading(true);

      // Use PATCH for updating instead of PUT to avoid 405 errors
      const res = await fetch(`/api/admin/blogs/${blog._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          video,
          status,
        }),
      });

      if (res.ok) {
        await fetch("/api/admin/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "EDIT_BLOG",
            entity: "blog",
            entityName: title,
          }),
        });
        toast.success("پست ویرایش شد ✨");
        onEdit();
        onClose();
      } else {
        // Try to get error text from server to show to user
        let msg = "خطا در بروزرسانی پست";
        try {
          const errData = await res.json();
          if (errData?.error) msg = errData.error;
        } catch {}
        toast.error(msg);
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div className={`${glass} relative w-full max-w-xl overflow-hidden rounded-2xl`}>
        {/* Close Button */}
        <button
          className="absolute left-4 top-4 text-slate-800 bg-white/70 rounded-full p-2 hover:bg-cyan-50 transition"
          onClick={onClose}
          title="بستن"
          disabled={loading}
        >
          <FiX size={22} />
        </button>
        <h2 className="bg-[#0b2545] px-6 py-5 text-right text-base font-extrabold text-white">
          ویرایش پست
        </h2>
        <form onSubmit={handleEdit} className="space-y-4 p-5 sm:p-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">عنوان</label>
            <input
              type="text"
              className={inputBase}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              maxLength={150}
              required
            />
          </div>
          {/* Video URL */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-1">
              <FiLink size={15} />
              لینک ویدیوی آپارات
            </label>
            <input
              type="text"
              className={inputBase}
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              disabled={loading}
              required
              maxLength={300}
              placeholder="https://aparat.com/..."
              dir="ltr"
            />
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2">وضعیت</label>
            <select
              className={inputBase}
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published")
              }
              disabled={loading}
            >
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
            </select>
          </div>
          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-7">
            <button
              type="button"
              className="bg-white px-6 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition"
              onClick={onClose}
              disabled={loading}
            >
              انصراف
            </button>
            <button
              type="submit"
              className="bg-cyan-600 px-8 py-2 rounded-xl text-white font-bold hover:bg-cyan-700 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "در حال بروزرسانی..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
