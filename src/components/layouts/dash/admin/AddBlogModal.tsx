"use client";
import { useEffect, useState } from "react";
import { FiX, FiLink } from "react-icons/fi";
import toast from "react-hot-toast";
import { useScrollLock } from "iso-hooks";

const glass =
  "bg-white/40 backdrop-blur-lg border border-white/30 shadow-cyan-500/20";
const inputBase =
  "w-full px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/30 focus:ring-2 focus:ring-cyan-500 outline-none transition-all";

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

  // --- Submit Blog ---
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
    // Regex validation (client-side, like backend)
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* --- Modal Container --- */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl sm:max-w-2xl mx-auto px-4 sm:px-6 rounded-2xl overflow-visible animate-slideUp"
      >
        {/* --- Header --- */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 p-4 text-white font-bold text-lg flex justify-between items-center">
          <span>افزودن پست جدید</span>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* --- Body --- */}
        <div
          className={`${glass} p-6 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/40 scrollbar-track-transparent`}
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
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-inner shadow-cyan-500/30 hover:shadow-cyan-500 transition-all active:scale-95 animate-fadeIn [animation-delay:0.2s]"
            >
              {loading ? "در حال ارسال..." : "افزودن پست"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
