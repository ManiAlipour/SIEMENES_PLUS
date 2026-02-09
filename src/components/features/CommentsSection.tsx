"use client";

import { useEffect, useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { useAuth } from "@/components/providers/AuthProvider";

/* ---------- Types ---------- */

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
  targetType: "product" | "post";
  targetId: string;
}

/* ---------- Constants ---------- */

const COMMENTS_PER_PAGE = 5;

/* ---------- Helpers ---------- */

const avatarColor = (name?: string) => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
  ];

  if (!name || typeof name !== "string") {
    return "bg-gray-400";
  }

  return colors[name.charCodeAt(0) % colors.length];
};

const getInitial = (name?: string) => {
  if (!name || typeof name !== "string") return "?";
  return name.trim().charAt(0).toUpperCase();
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ---------- Component ---------- */

export default function CommentsSection({
  targetType,
  targetId,
}: CommentsSectionProps) {
  const { isAuthenticated } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------- Fetch Comments ---------- */

  useEffect(() => {
    fetchComments();
  }, [targetId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/comments?targetType=${targetType}&targetId=${targetId}`,
      );
      const { data, error } = await res.json();

      if (!res.ok) throw new Error(error);
      setComments(data);
      setVisibleCount(COMMENTS_PER_PAGE);
    } catch {
      setError("خطا در دریافت نظرات");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Submit Comment ---------- */

  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          text: newComment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewComment("");
      setSuccess("✅ نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.");
    } catch {
      setError("خطا در ارسال نظر");
    } finally {
      setSubmitting(false);
    }
  };

  const visibleComments = comments.slice(0, visibleCount);

  /* ---------- Render ---------- */

  return (
    <section className="mt-14">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">💬 نظرات کاربران</h3>
        <span className="text-sm text-gray-500">{comments.length} نظر</span>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر شما درباره این محتوا..."
            rows={4}
            maxLength={2000}
            className="w-full resize-none bg-transparent text-sm leading-7 placeholder:text-gray-400 focus:outline-none"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {newComment.length} / 2000
            </span>

            <button
              onClick={submitComment}
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:bg-gray-300"
            >
              {submitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
              ارسال نظر
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          {success && (
            <p className="mt-3 text-sm text-emerald-600">{success}</p>
          )}
        </div>
      ) : (
        <div className="mb-10 rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-600">
          برای ارسال نظر ابتدا{" "}
          <a href="/auth/login" className="font-medium text-blue-600">
            وارد شوید
          </a>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="py-12 text-center text-gray-400">
          <FaSpinner className="mx-auto mb-3 animate-spin" size={22} />
          در حال بارگذاری نظرات...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-14 text-center text-gray-400">
          💭 هنوز نظری ثبت نشده <br />
          اولین نفر باشید
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {visibleComments.map((comment) => (
              <div
                key={comment._id}
                className="group rounded-2xl p-4 transition hover:bg-gray-50"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(
                      comment.user?.name,
                    )}`}
                  >
                    {getInitial(comment.user?.name)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.user?.name ?? "کاربر ناشناس"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>

                <p className="pr-13 text-sm leading-7 text-gray-700">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>

          {visibleCount < comments.length && (
            <div className="pt-6 text-center">
              <button
                onClick={() =>
                  setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)
                }
                className="rounded-xl border border-gray-200 px-6 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                نمایش نظرات بیشتر
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
