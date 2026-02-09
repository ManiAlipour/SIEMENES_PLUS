"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import CommentPreviewModal from "@/components/ui/admin/comments/CommentPreviewModal";
import DeleteCommentModal from "@/components/ui/admin/comments/DeleteCommentModal";

interface CommentUser {
  _id: string;
  name?: string;
  email?: string;
}

interface Comment {
  _id: string;
  user?: CommentUser;
  text: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filtered, setFiltered] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteComment, setDeleteComment] = useState<Comment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "pending"
  >("all");

  const [previewComment, setPreviewComment] = useState<Comment | null>(null);

  // ───────────────────────────────────────────────
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/comments");
      const { data } = await res.json();
      setComments(data);
      setFiltered(data);
    } catch {
      toast.error("خطا در دریافت کامنت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    let temp = [...comments];

    if (statusFilter !== "all") {
      temp = temp.filter((c) =>
        statusFilter === "approved" ? c.approved : !c.approved,
      );
    }

    if (search.trim()) {
      temp = temp.filter(
        (c) =>
          c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.user?.email?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFiltered(temp);
  }, [comments, statusFilter, search]);

  // ───────────────────────────────────────────────
  const handleStatusChange = async (id: string, approve: boolean) => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: id, approved: approve }),
      });

      if (!res.ok) throw new Error();

      toast.success(approve ? "کامنت تأیید شد ✅" : "کامنت به انتظار برگشت ⏳");
      fetchComments();
    } catch {
      toast.error("خطا در بروزرسانی وضعیت");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("کامنت حذف شد 🗑");
      fetchComments();
    } catch {
      toast.error("خطا در حذف کامنت");
    }
  };

  const confirmDelete = async () => {
    if (!deleteComment) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(`/api/admin/comments/${deleteComment._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("کامنت حذف شد 🗑");
      setDeleteComment(null);
      fetchComments();
    } catch {
      toast.error("خطا در حذف کامنت");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ───────────────────────────────────────────────
  return (
    <div className="p-6 font-vazirmatn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-2xl p-5 shadow-lg">
        <h1 className="text-xl font-bold">مدیریت کامنت‌ها</h1>

        <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl">
          <FiSearch />
          <input
            type="text"
            placeholder="جستجو نام یا ایمیل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm placeholder-white/70"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white/20 rounded-lg text-xs px-2 py-1 outline-none"
          >
            <option value="all">همه</option>
            <option value="approved">تأییدشده</option>
            <option value="pending">در انتظار</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white/80 backdrop-blur-md rounded-xl shadow border">
          <thead className="bg-cyan-50 text-xs">
            <tr>
              <th className="px-4 py-3 text-left">کاربر</th>
              <th className="px-4 py-3 text-left">ایمیل</th>
              <th className="px-4 py-3 text-left">متن</th>
              <th className="px-4 py-3 text-center">وضعیت</th>
              <th className="px-4 py-3 text-center">تاریخ</th>
              <th className="px-4 py-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length > 0 ? (
              filtered.map((c) => (
                <tr key={c._id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">{c.user?.name || "—"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {c.user?.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setPreviewComment(c)}
                      className="text-cyan-700 hover:underline line-clamp-1"
                    >
                      {c.text}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        c.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.approved ? "تأییدشده" : "در انتظار"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => setPreviewComment(c)}
                      title="مشاهده"
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                    >
                      <FiEye />
                    </button>

                    {c.approved ? (
                      <button
                        onClick={() => handleStatusChange(c._id, false)}
                        title="بازگشت به انتظار"
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                      >
                        <FiXCircle />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(c._id, true)}
                        title="تأیید"
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <FiCheckCircle />
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteComment(c)}
                      title="حذف"
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-sm text-slate-500"
                >
                  {loading ? "در حال بارگذاری..." : "کامنتی یافت نشد"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      <CommentPreviewModal
        open={!!previewComment}
        onClose={() => setPreviewComment(null)}
        comment={previewComment}
      />

      {/* Delete Comment Modal */}
      <DeleteCommentModal
        open={!!deleteComment}
        comment={deleteComment}
        loading={deleteLoading}
        onClose={() => setDeleteComment(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
