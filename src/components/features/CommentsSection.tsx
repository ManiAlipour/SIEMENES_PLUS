"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaSpinner,
  FaCommentDots,
  FaUserLock,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/components/providers/AuthProvider";

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
}

interface CommentsSectionProps {
  targetType: "product" | "post" | "blogPost";
  targetId: string;
  title?: string;
}

type SortOrder = "newest" | "oldest";

const COMMENTS_PER_PAGE = 5;
const MAX_LENGTH = 2000;
const SUCCESS_DISMISS_MS = 4000;

const avatarColor = (name?: string) => {
  const colors = [
    "bg-cyan-600",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
  ];
  if (!name || typeof name !== "string") return "bg-slate-400";
  return colors[name.charCodeAt(0) % colors.length];
};

const getInitial = (name?: string) => {
  if (!name || typeof name !== "string") return "?";
  return name.trim().charAt(0).toUpperCase();
};

const formatCommentCount = (count: number) => {
  const formatted = count.toLocaleString("fa-IR");
  if (count === 0) return "بدون نظر";
  return `${formatted} نظر`;
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

function CommentSkeleton() {
  return (
    <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5 animate-pulse">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-24 rounded bg-slate-200" />
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
      </div>
    </li>
  );
}

export default function CommentsSection({
  targetType,
  targetId,
  title = "نظرات",
}: CommentsSectionProps) {
  const { isAuthenticated } = useAuth();
  const listRef = useRef<HTMLUListElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError("");
      const res = await fetch(
        `/api/comments?targetType=${targetType}&targetId=${targetId}`,
      );
      const { data, error: apiError } = await res.json();
      if (!res.ok) throw new Error(apiError);
      setComments(data ?? []);
      setVisibleCount(COMMENTS_PER_PAGE);
    } catch {
      setFetchError("خطا در دریافت نظرات");
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

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

  const sortedComments =
    sortOrder === "newest" ? comments : [...comments].reverse();

  const visibleComments = sortedComments.slice(0, visibleCount);

  const submitComment = async () => {
    const text = newComment.trim();
    if (!text || submitting) return;

    try {
      setSubmitting(true);
      setSubmitError("");
      setSuccess("");

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      setNewComment("");
      setSuccess("نظر شما با موفقیت ثبت شد.");
      textareaRef.current?.focus();

      const listRes = await fetch(
        `/api/comments?targetType=${targetType}&targetId=${targetId}`,
      );
      const listJson = await listRes.json();
      const fresh: Comment[] = listJson.data ?? [];
      setComments(fresh);
      setVisibleCount(COMMENTS_PER_PAGE);
      setSortOrder("newest");

      const newestId = fresh[0]?._id;
      if (newestId) {
        setHighlightId(newestId);
        requestAnimationFrame(() => {
          document
            .getElementById(`comment-${newestId}`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
    } catch {
      setSubmitError("خطا در ارسال نظر. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      submitComment();
    }
  };

  const charRatio = newComment.length / MAX_LENGTH;
  const charCounterClass =
    charRatio >= 0.95
      ? "text-red-500 font-medium"
      : charRatio >= 0.8
        ? "text-amber-600"
        : "text-slate-400";

  return (
    <section
      className="mt-10 sm:mt-14 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm"
      aria-labelledby="comments-section-heading"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <FaCommentDots size={16} />
          </span>
          <h2
            id="comments-section-heading"
            className="text-lg sm:text-xl font-bold text-slate-900"
          >
            {title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {comments.length > 1 && (
            <div
              className="inline-flex rounded-lg border border-slate-200 p-0.5 text-xs"
              role="group"
              aria-label="مرتب‌سازی نظرات"
            >
              <button
                type="button"
                onClick={() => setSortOrder("newest")}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  sortOrder === "newest"
                    ? "bg-cyan-600 text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                جدیدترین
              </button>
              <button
                type="button"
                onClick={() => setSortOrder("oldest")}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  sortOrder === "oldest"
                    ? "bg-cyan-600 text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                قدیمی‌ترین
              </button>
            </div>
          )}
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
            {formatCommentCount(comments.length)}
          </span>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="mb-8 rounded-2xl border border-cyan-100 bg-gradient-to-b from-cyan-50/50 to-white p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(
                currentUserName ?? undefined,
              )}`}
            >
              {getInitial(currentUserName ?? undefined)}
            </div>
            <label htmlFor="new-comment" className="text-sm font-semibold text-slate-800">
              {currentUserName ? `${currentUserName}، نظر شما` : "نظر شما"}
            </label>
          </div>

          <textarea
            ref={textareaRef}
            id="new-comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="تجربه یا سوال خود را بنویسید..."
            rows={4}
            maxLength={MAX_LENGTH}
            disabled={submitting}
            className="w-full resize-y min-h-[6rem] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-800 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-60"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className={charCounterClass}>
                {newComment.length.toLocaleString("fa-IR")} /{" "}
                {MAX_LENGTH.toLocaleString("fa-IR")}
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline text-slate-400">
                Ctrl + Enter برای ارسال
              </span>
            </div>
            <button
              type="button"
              onClick={submitComment}
              disabled={submitting || !newComment.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane size={14} />
              )}
              {submitting ? "در حال ارسال..." : "ارسال نظر"}
            </button>
          </div>

          <div aria-live="polite" className="mt-3 space-y-1">
            {submitError && (
              <p className="text-sm text-red-600">{submitError}</p>
            )}
            {success && (
              <p className="text-sm text-emerald-600 animate-fadeIn">{success}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 sm:p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <FaUserLock size={20} />
          </div>
          <p className="text-sm font-medium text-slate-700">
            برای شرکت در گفتگو وارد حساب کاربری شوید
          </p>
          <p className="mt-1 text-xs text-slate-500">
            پس از ورود می‌توانید نظر خود را ثبت کنید.
          </p>
          <Link
            href="/auth/login"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
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
            onClick={fetchComments}
            className="mr-2 font-semibold underline hover:no-underline"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {loading ? (
        <ul className="space-y-5" aria-busy="true" aria-label="در حال بارگذاری نظرات">
          {Array.from({ length: 3 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </ul>
      ) : comments.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FaCommentDots size={24} />
          </div>
          <p className="font-medium text-slate-600">هنوز نظری ثبت نشده</p>
          <p className="mt-1 text-sm text-slate-500">
            {isAuthenticated
              ? "اولین نفری باشید که نظر می‌دهد."
              : "اولین نظر را شما بگذارید — پس از ورود."}
          </p>
        </div>
      ) : (
        <>
          <ul ref={listRef} className="space-y-4">
            {visibleComments.map((comment) => {
              const { relative, full } = formatRelativeTime(comment.createdAt);
              const isHighlighted = highlightId === comment._id;

              return (
                <li
                  key={comment._id}
                  id={`comment-${comment._id}`}
                  className={`rounded-xl border p-4 sm:p-5 transition-all duration-500 animate-fadeIn ${
                    isHighlighted
                      ? "border-cyan-300 bg-cyan-50/60 ring-2 ring-cyan-200/80"
                      : "border-slate-100 bg-slate-50/60"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(
                        comment.user?.name,
                      )}`}
                      aria-hidden
                    >
                      {getInitial(comment.user?.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {comment.user?.name ?? "کاربر"}
                      </p>
                      <time
                        className="text-xs text-slate-400"
                        dateTime={new Date(comment.createdAt).toISOString()}
                        title={full}
                      >
                        {relative}
                      </time>
                    </div>
                  </div>
                  <p
                    className="text-sm leading-7 text-slate-700 whitespace-pre-wrap break-words"
                    dir="auto"
                  >
                    {comment.text}
                  </p>
                </li>
              );
            })}
          </ul>

          {visibleCount < sortedComments.length && (
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
              >
                <FiChevronDown size={16} />
                نمایش {(sortedComments.length - visibleCount).toLocaleString("fa-IR")}{" "}
                نظر دیگر
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
