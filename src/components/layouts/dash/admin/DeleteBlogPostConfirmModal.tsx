"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

interface DeleteBlogPostConfirmModalProps {
  postTitle: string;
  postId: string;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteBlogPostConfirmModal({
  postTitle,
  postId,
  onClose,
  onDeleted,
}: DeleteBlogPostConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog-posts/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("مطلب حذف شد");
        onDeleted();
      } else {
        const data = await res.json();
        toast.error(data?.error || "خطا در حذف مطلب");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-blog-title"
      aria-describedby="delete-blog-desc"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-50 px-5 py-4 border-b border-red-100">
          <div className="flex justify-between items-center">
            <h3 id="delete-blog-title" className="font-bold text-red-800">حذف مطلب</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-red-100 text-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="بستن"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <p id="delete-blog-desc" className="text-slate-600 mb-6 leading-relaxed">
            آیا از حذف مطلب <strong className="text-slate-800">«{postTitle}»</strong> اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  در حال حذف...
                </>
              ) : (
                "حذف"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
