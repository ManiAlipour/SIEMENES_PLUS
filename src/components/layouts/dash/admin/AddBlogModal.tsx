"use client";
import { useEffect, useState } from "react";
import { FiX, FiLink } from "react-icons/fi";
import toast from "react-hot-toast";
import { useScrollLock } from "iso-hooks";

const glass =
  "border border-slate-200 bg-white shadow-2xl shadow-slate-950/20";
const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

interface AddBlogModalProps {
  onClose: () => void;
  onAdd: () => void;
}

export default function AddBlogModal({ onClose, onAdd }: AddBlogModalProps) {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(""); // Aparat video link only
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(false);

  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    lock();
    return () => {
      unlock();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("عنوان الزامی است");
      return;
    }
    if (!video.trim()) {
      toast.error("لینک آپارات الزامی است");
      return;
    }
    const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
    if (!aparatRegex.test(video)) {
      toast.error("لینک ویدیو باید آدرس صحیح از Aparat باشد");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
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
            action: "ADD_BLOG",
            entity: "blog",
            entityName: title,
          }),
        });
        toast.success("پست افزوده شد ✨");
        onAdd();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || "خطا در افزودن پست");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      onClick={(event) => { if (event.target === event.currentTarget && !loading) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      {/* --- Modal Container --- */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl ${glass}`}
      >
        {/* --- Header --- */}
        <div className="flex items-center justify-between bg-[#0b2545] p-4 text-base font-extrabold text-white sm:px-6 sm:py-5">
          <span>افزودن پست جدید</span>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* --- Body --- */}
        <div
          className="max-h-[82vh] overflow-y-auto p-4 sm:p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-fadeIn [animation-delay:0.05s]">
              <input
                className={inputBase}
                placeholder="عنوان پست"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={150}
              />
            </div>

            <div className="animate-fadeIn [animation-delay:0.1s]">
              <div className="flex items-center gap-2 text-slate-700">
                <FiLink className="text-cyan-600" />
                <span className="text-sm">لینک ویدیوی آپارات</span>
              </div>
              <input
                className={`${inputBase} mt-2`}
                dir="ltr"
                placeholder="https://www.aparat.com/v/..."
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                required
              />
            </div>

            {/* --- Status --- */}
            <div className="flex gap-4 mt-4 text-slate-700 animate-fadeIn [animation-delay:0.15s]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                />
                <span>پیش‌نویس</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                />
                <span>منتشر شود</span>
              </label>
            </div>

            {/* --- Submit --- */}
            <button
              disabled={loading}
              type="submit"
              className="mt-6 w-full rounded-xl bg-blue-700 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "در حال ارسال..." : "افزودن پست"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
