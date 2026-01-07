"use client";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const glass =
  "bg-white/40 backdrop-blur-lg border border-white/30 shadow-cyan-500/20";

interface DeleteBlogConfirmModalProps {
  blogTitle: string;
  blogId: string;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteBlogConfirmModal({
  blogTitle,
  blogId,
  onClose,
  onDeleted,
}: DeleteBlogConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, { method: "DELETE" });
      if (res.ok) {
        await fetch("/api/admin/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "DELETE_BLOG",
            entity: "blog",
            entityName: blogTitle,
          }),
        });
        toast.success("پست حذف شد ✅", { className: "font-vazirmatn" });
        onDeleted();
        onClose();
      } else {
        toast.error("خطا در حذف پست");
      }
    } catch (err) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 font-vazirmatn">
      <div className={`max-w-[95vw] w-full sm:w-[400px] rounded-2xl p-7 relative ${glass}`}>
        <button
          onClick={onClose}
          className="absolute left-3 top-3 text-slate-500 hover:text-rose-500 transition text-lg"
          disabled={loading}
        >
          <FiX />
        </button>
        <h2 className="text-center text-lg font-bold text-rose-600 mb-3">حذف پست</h2>
        <p className="text-center mb-6">
          آیا از حذف پست <span className="font-bold text-slate-800">"{blogTitle}"</span> مطمئن هستید؟
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-slate-700 px-5 py-2 rounded-xl border border-slate-200 font-semibold transition"
            onClick={onClose}
            disabled={loading}
          >
            انصراف
          </button>
          <button
            className="bg-rose-600 hover:bg-rose-700 text-white px-7 py-2 rounded-xl font-bold transition disabled:opacity-60"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "در حال حذف..." : "بله، حذف کن"}
          </button>
        </div>
      </div>
    </div>
  );
}
