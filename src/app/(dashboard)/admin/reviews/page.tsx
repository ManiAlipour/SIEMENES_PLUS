"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiStar,
  FiCheck,
  FiX,
} from "react-icons/fi";

interface ReviewUser {
  _id: string;
  name?: string;
  email?: string;
}

interface ReviewProduct {
  _id: string;
  name?: string;
  slug?: string;
  modelNumber?: string;
}

interface Review {
  _id: string;
  user?: ReviewUser;
  product?: ReviewProduct;
  rating: number;
  title?: string;
  text: string;
  approved: boolean;
  createdAt: string;
}

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

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">(
    "all",
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      const res = await fetch("/api/admin/reviews", { cache: "no-store" });
      const { data, error } = await res.json();
      if (!res.ok) throw new Error(error);
      setReviews(data ?? []);
    } catch {
      toast.error("خطا در دریافت نظرات");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (statusFilter === "approved" && !r.approved) return false;
      if (statusFilter === "pending" && r.approved) return false;
      if (!q) return true;
      return (
        r.text.toLowerCase().includes(q) ||
        r.title?.toLowerCase().includes(q) ||
        r.user?.name?.toLowerCase().includes(q) ||
        r.user?.email?.toLowerCase().includes(q) ||
        r.product?.name?.toLowerCase().includes(q) ||
        r.product?.modelNumber?.toLowerCase().includes(q)
      );
    });
  }, [reviews, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: reviews.length,
      approved: reviews.filter((r) => r.approved).length,
      pending: reviews.filter((r) => !r.approved).length,
    }),
    [reviews],
  );

  const toggleApproved = async (review: Review) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review._id,
          approved: !review.approved,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setReviews((prev) =>
        prev.map((r) =>
          r._id === review._id ? { ...r, approved: !r.approved } : r,
        ),
      );
      toast.success(
        !review.approved ? "نظر تأیید شد" : "نظر از نمایش عمومی خارج شد",
      );
    } catch {
      toast.error("خطا در به‌روزرسانی وضعیت");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("این نظر حذف شود؟")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("نظر حذف شد");
    } catch {
      toast.error("خطا در حذف نظر");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">امتیاز و نظرات</h1>
          <p className="mt-1 text-sm text-slate-500">
            مدیریت نظرات ستاره‌دار محصولات
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchReviews(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          بروزرسانی
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatMini label="کل نظرات" value={stats.total} accent="text-slate-900" />
        <StatMini
          label="تأییدشده"
          value={stats.approved}
          accent="text-emerald-600"
        />
        <StatMini
          label="در انتظار"
          value={stats.pending}
          accent="text-amber-600"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در متن، کاربر یا محصول..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-4 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
        <div className="inline-flex rounded-xl border border-slate-200 p-0.5 text-xs">
          {(
            [
              ["all", "همه"],
              ["approved", "تأییدشده"],
              ["pending", "در انتظار"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`rounded-lg px-3 py-2 font-medium transition ${
                statusFilter === value
                  ? "bg-cyan-600 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-500">
          نظری یافت نشد
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {filtered.map((review) => (
              <li key={review._id} className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        <FiStar className="fill-amber-400 text-amber-400" />
                        {review.rating.toLocaleString("fa-IR")}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          review.approved
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {review.approved ? "تأییدشده" : "در انتظار"}
                      </span>
                      <time className="text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                      </time>
                    </div>

                    <p className="text-sm font-semibold text-slate-800">
                      {review.user?.name || "کاربر"}{" "}
                      <span className="font-normal text-slate-400">
                        {review.user?.email}
                      </span>
                    </p>

                    {review.product?.name && (
                      <Link
                        href={`/shop/${review.product.slug}`}
                        className="text-sm text-cyan-700 hover:underline"
                        target="_blank"
                      >
                        {review.product.name}
                        {review.product.modelNumber
                          ? ` — ${review.product.modelNumber}`
                          : ""}
                      </Link>
                    )}

                    {review.title ? (
                      <p className="text-sm font-bold text-slate-700">
                        {review.title}
                      </p>
                    ) : null}
                    <p className="text-sm leading-7 text-slate-600 whitespace-pre-wrap">
                      {review.text}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleApproved(review)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      {review.approved ? (
                        <>
                          <FiX /> مخفی
                        </>
                      ) : (
                        <>
                          <FiCheck /> تأیید
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReview(review._id)}
                      disabled={deletingId === review._id}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <FiTrash2 />
                      حذف
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
