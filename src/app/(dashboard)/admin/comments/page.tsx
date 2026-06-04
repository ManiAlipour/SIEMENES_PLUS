"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiTrash2,
  FiSearch,
  FiEye,
  FiMessageSquare,
  FiRefreshCw,
  FiFilter,
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
  targetType?: string;
  createdAt: string;
}

const targetTypeLabel: Record<string, string> = {
  product: "محصول",
  post: "پست",
  blogPost: "وبلاگ",
};

const TYPE_FILTERS = [
  { value: "all", label: "همه" },
  { value: "blogPost", label: "وبلاگ" },
  { value: "product", label: "محصول" },
  { value: "post", label: "پست" },
] as const;

function StatMini({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`mt-0.5 text-xl font-bold tabular-nums ${accent}`}>
        {value.toLocaleString("fa-IR")}
      </p>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="hidden md:block space-y-2 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 rounded-lg bg-slate-100" />
      ))}
    </div>
  );
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteComment, setDeleteComment] = useState<Comment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "product" | "blogPost" | "post"
  >("all");
  const [previewComment, setPreviewComment] = useState<Comment | null>(null);

  const fetchComments = async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      const res = await fetch("/api/admin/comments", { cache: "no-store" });
      const { data } = await res.json();
      setComments(data ?? []);
    } catch {
      toast.error("خطا در دریافت کامنت‌ها");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const filtered = useMemo(() => {
    let temp = [...comments];
    if (typeFilter !== "all") {
      temp = temp.filter((c) => c.targetType === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (c) =>
          c.user?.name?.toLowerCase().includes(q) ||
          c.user?.email?.toLowerCase().includes(q) ||
          c.text.toLowerCase().includes(q),
      );
    }
    return temp;
  }, [comments, typeFilter, search]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: comments.length,
      blog: comments.filter((c) => c.targetType === "blogPost").length,
      product: comments.filter((c) => c.targetType === "product").length,
      today: comments.filter((c) => new Date(c.createdAt) >= today).length,
    };
  }, [comments]);

  const confirmDelete = async () => {
    if (!deleteComment) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/admin/comments/${deleteComment._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("کامنت حذف شد");
      setDeleteComment(null);
      fetchComments(true);
    } catch {
      toast.error("خطا در حذف کامنت");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 font-vazirmatn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <FiMessageSquare size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">مدیریت نظرات</h1>
            <p className="text-sm text-cyan-100 mt-0.5">
              مشاهده، جستجو و حذف نظرات کاربران
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchComments(true)}
          disabled={refreshing}
          className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 disabled:opacity-60 transition-colors"
        >
          <FiRefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          به‌روزرسانی
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="کل نظرات" value={stats.total} accent="text-slate-800" />
        <StatMini label="وبلاگ" value={stats.blog} accent="text-cyan-600" />
        <StatMini label="محصول" value={stats.product} accent="text-emerald-600" />
        <StatMini label="امروز" value={stats.today} accent="text-violet-600" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو در نام، ایمیل یا متن..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pr-10 pl-4 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <FiFilter className="text-slate-400 shrink-0" size={16} />
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === f.value
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          {filtered.length.toLocaleString("fa-IR")} نظر
          {search || typeFilter !== "all" ? " (فیلترشده)" : ""}
        </p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <FiMessageSquare className="mx-auto mb-3 text-slate-300" size={36} />
          <p className="font-medium text-slate-600">نظری یافت نشد</p>
          <p className="mt-1 text-sm text-slate-400">
            {search || typeFilter !== "all"
              ? "فیلترها را تغییر دهید یا جستجو را پاک کنید."
              : "هنوز نظری ثبت نشده است."}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold">کاربر</th>
                  <th className="px-4 py-3 text-right font-semibold">نوع</th>
                  <th className="px-4 py-3 text-right font-semibold">متن</th>
                  <th className="px-4 py-3 text-center font-semibold">تاریخ</th>
                  <th className="px-4 py-3 text-center font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.user?.name || "—"}</p>
                      {c.user?.email && (
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {c.user.email}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {targetTypeLabel[c.targetType ?? ""] ??
                          c.targetType ??
                          "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewComment(c)}
                        className="text-cyan-700 hover:underline line-clamp-2 text-right w-full"
                      >
                        {c.text}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewComment(c)}
                          title="مشاهده"
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        >
                          <FiEye />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteComment(c)}
                          title="حذف"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <span className="font-semibold text-sm">
                      {c.user?.name || "کاربر"}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {targetTypeLabel[c.targetType ?? ""] ?? "—"}
                  </span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-3 mb-3">{c.text}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewComment(c)}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-cyan-700 font-medium"
                  >
                    مشاهده
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteComment(c)}
                    className="flex-1 py-2 rounded-lg border border-red-200 text-sm text-red-600 font-medium"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <CommentPreviewModal
        open={!!previewComment}
        onClose={() => setPreviewComment(null)}
        comment={previewComment}
      />

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
