"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaSpinner,
  FaStar,
  FaUserLock,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/components/providers/AuthProvider";

interface Review {
  _id: string;
  rating: number;
  title?: string;
  text: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
}

interface Aggregate {
  averageRating: number;
  reviewCount: number;
}

interface ReviewsSectionProps {
  productId: string;
  productName: string;
  initialAggregate?: Aggregate;
}

const REVIEWS_PER_PAGE = 5;
const MAX_LENGTH = 2000;
const SUCCESS_DISMISS_MS = 4000;

const avatarColor = (name?: string) => {
  const colors = [
    "bg-amber-500",
    "bg-orange-500",
    "bg-cyan-600",
    "bg-emerald-500",
    "bg-rose-500",
  ];
  if (!name || typeof name !== "string") return "bg-slate-400";
  return colors[name.charCodeAt(0) % colors.length];
};

const getInitial = (name?: string) => {
  if (!name || typeof name !== "string") return "?";
  return name.trim().charAt(0).toUpperCase();
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  const full = date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let relative: string;
  if (diffMin < 1) relative = "همین الان";
  else if (diffMin < 60)
    relative = `${diffMin.toLocaleString("fa-IR")} دقیقه پیش`;
  else if (diffHour < 24)
    relative = `${diffHour.toLocaleString("fa-IR")} ساعت پیش`;
  else if (diffDay < 7)
    relative = `${diffDay.toLocaleString("fa-IR")} روز پیش`;
  else if (diffWeek < 4)
    relative = `${diffWeek.toLocaleString("fa-IR")} هفته پیش`;
  else if (diffMonth < 12)
    relative = `${diffMonth.toLocaleString("fa-IR")} ماه پیش`;
  else
    relative = date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return { relative, full };
};

function Stars({
  value,
  size = 16,
  interactive = false,
  onChange,
}: {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={interactive ? "radiogroup" : "img"}
      aria-label={`${value} از ۵ ستاره`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = display >= n;
        if (!interactive) {
          return (
            <FaStar
              key={n}
              size={size}
              className={filled ? "text-amber-400" : "text-slate-200"}
            />
          );
        }

        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ستاره`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onChange?.(n)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <FaStar
              size={size}
              className={filled ? "text-amber-400" : "text-slate-200"}
            />
          </button>
        );
      })}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5 animate-pulse">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-24 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
      </div>
    </li>
  );
}

export default function ReviewsSection({
  productId,
  productName,
  initialAggregate,
}: ReviewsSectionProps) {
  const { isAuthenticated } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [aggregate, setAggregate] = useState<Aggregate>(
    initialAggregate ?? { averageRating: 0, reviewCount: 0 },
  );
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError("");
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setReviews(json.data ?? []);
      if (json.aggregate) setAggregate(json.aggregate);
      setVisibleCount(REVIEWS_PER_PAGE);
    } catch {
      setFetchError("خطا در دریافت نظرات");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUserName(null);
      return;
    }

    let cancelled = false;
    fetch("/api/users/get-one", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json?.data?.name) {
          setCurrentUserName(json.data.name);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(""), SUCCESS_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!highlightId) return;
    const timer = window.setTimeout(() => setHighlightId(null), 3000);
    return () => window.clearTimeout(timer);
  }, [highlightId]);

  const submitReview = async () => {
    const body = text.trim();
    if (!rating || !body || submitting) return;

    try {
      setSubmitting(true);
      setSubmitError("");
      setSuccess("");

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim(),
          text: body,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setText("");
      setTitle("");
      setRating(0);
      setSuccess(
        data.updated
          ? "نظر شما به‌روزرسانی شد."
          : "نظر و امتیاز شما با موفقیت ثبت شد.",
      );
      textareaRef.current?.focus();

      const listRes = await fetch(`/api/reviews?productId=${productId}`);
      const listJson = await listRes.json();
      const fresh: Review[] = listJson.data ?? [];
      setReviews(fresh);
      if (listJson.aggregate) setAggregate(listJson.aggregate);
      setVisibleCount(REVIEWS_PER_PAGE);

      const newestId = fresh[0]?._id;
      if (newestId) {
        setHighlightId(newestId);
        requestAnimationFrame(() => {
          document
            .getElementById(`review-${newestId}`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
    } catch (err: any) {
      setSubmitError(err?.message || "خطا در ارسال نظر. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct =
      aggregate.reviewCount > 0
        ? Math.round((count / aggregate.reviewCount) * 100)
        : 0;
    return { star, count, pct };
  });

  return (
    <section
      id="product-reviews"
      className="mt-10 sm:mt-14 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm"
      aria-labelledby="reviews-section-heading"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <FaStar size={16} />
          </span>
          <h2
            id="reviews-section-heading"
            className="text-lg sm:text-xl font-bold text-slate-900"
          >
            امتیاز و نظرات کاربران
          </h2>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          {aggregate.reviewCount > 0
            ? `${aggregate.reviewCount.toLocaleString("fa-IR")} نظر`
            : "بدون نظر"}
        </span>
      </div>

      <div className="mb-8 grid gap-6 rounded-2xl border border-amber-100/80 bg-gradient-to-br from-amber-50/40 to-white p-5 sm:grid-cols-[auto_1fr] sm:gap-8">
        <div className="flex flex-col items-center justify-center text-center sm:min-w-[140px]">
          <p className="text-4xl font-black tabular-nums text-slate-900">
            {aggregate.reviewCount > 0
              ? aggregate.averageRating.toLocaleString("fa-IR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              : "—"}
          </p>
          <div className="mt-2">
            <Stars value={Math.round(aggregate.averageRating)} size={18} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            از ۵ بر اساس {aggregate.reviewCount.toLocaleString("fa-IR")} نظر
          </p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-10 shrink-0 text-slate-500">
                {star.toLocaleString("fa-IR")} ستاره
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-left tabular-nums text-slate-400">
                {count.toLocaleString("fa-IR")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isAuthenticated ? (
        <div className="mb-8 rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/40 to-white p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(
                currentUserName ?? undefined,
              )}`}
            >
              {getInitial(currentUserName ?? undefined)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {currentUserName
                  ? `${currentUserName}، امتیاز شما به ${productName}`
                  : `امتیاز شما به ${productName}`}
              </p>
              <p className="text-xs text-slate-500">
                اگر قبلاً نظر داده‌اید، با ارسال مجدد به‌روزرسانی می‌شود.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <Stars
              value={rating}
              size={28}
              interactive
              onChange={setRating}
            />
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان نظر (اختیاری)"
            maxLength={120}
            disabled={submitting}
            className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 disabled:opacity-60"
          />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="تجربه خود از کیفیت، اصالت و کاربرد محصول را بنویسید..."
            rows={4}
            maxLength={MAX_LENGTH}
            disabled={submitting}
            className="w-full resize-y min-h-[6rem] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 disabled:opacity-60"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              {text.length.toLocaleString("fa-IR")} /{" "}
              {MAX_LENGTH.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              onClick={submitReview}
              disabled={submitting || !rating || text.trim().length < 5}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane size={14} />
              )}
              {submitting ? "در حال ارسال..." : "ثبت امتیاز و نظر"}
            </button>
          </div>

          <div aria-live="polite" className="mt-3 space-y-1">
            {submitError && (
              <p className="text-sm text-red-600">{submitError}</p>
            )}
            {success && (
              <p className="text-sm text-emerald-600">{success}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 sm:p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <FaUserLock size={20} />
          </div>
          <p className="text-sm font-medium text-slate-700">
            برای ثبت امتیاز وارد حساب کاربری شوید
          </p>
          <Link
            href="/auth/login"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            ورود به حساب
          </Link>
        </div>
      )}

      {fetchError && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
          <button
            type="button"
            onClick={fetchReviews}
            className="mr-2 font-semibold underline hover:no-underline"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {loading ? (
        <ul className="space-y-5" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </ul>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-400">
            <FaStar size={24} />
          </div>
          <p className="font-medium text-slate-600">هنوز امتیازی ثبت نشده</p>
          <p className="mt-1 text-sm text-slate-500">
            اولین نفری باشید که به این محصول امتیاز می‌دهد.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {reviews.slice(0, visibleCount).map((review) => {
              const { relative, full } = formatRelativeTime(review.createdAt);
              const isHighlighted = highlightId === review._id;

              return (
                <li
                  key={review._id}
                  id={`review-${review._id}`}
                  className={`rounded-xl border p-4 sm:p-5 transition-all duration-500 ${
                    isHighlighted
                      ? "border-amber-300 bg-amber-50/60 ring-2 ring-amber-200/80"
                      : "border-slate-100 bg-slate-50/60"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(
                        review.user?.name,
                      )}`}
                      aria-hidden
                    >
                      {getInitial(review.user?.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {review.user?.name ?? "کاربر"}
                        </p>
                        <Stars value={review.rating} size={12} />
                      </div>
                      <time
                        className="text-xs text-slate-400"
                        dateTime={new Date(review.createdAt).toISOString()}
                        title={full}
                      >
                        {relative}
                      </time>
                    </div>
                  </div>
                  {review.title ? (
                    <p className="mb-1 text-sm font-bold text-slate-800">
                      {review.title}
                    </p>
                  ) : null}
                  <p
                    className="text-sm leading-7 text-slate-700 whitespace-pre-wrap break-words"
                    dir="auto"
                  >
                    {review.text}
                  </p>
                </li>
              );
            })}
          </ul>

          {visibleCount < reviews.length && (
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => prev + REVIEWS_PER_PAGE)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800 transition-colors"
              >
                <FiChevronDown size={16} />
                نمایش {(reviews.length - visibleCount).toLocaleString("fa-IR")}{" "}
                نظر دیگر
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
