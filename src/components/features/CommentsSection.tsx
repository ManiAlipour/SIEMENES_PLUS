"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { FaUser, FaPaperPlane, FaSpinner } from "react-icons/fa";

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface CommentsSectionProps {
  targetType: "product" | "post";
  targetId: string;
}

export default function CommentsSection({
  targetType,
  targetId,
}: CommentsSectionProps) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, [targetId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/comments?targetType=${targetType}&targetId=${targetId}`,
      );
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
      } else {
        setError(data.error || "خطا در بارگذاری کامنت‌ها");
      }
    } catch (err) {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetType,
          targetId,
          text: newComment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewComment("");
        // کامنت جدید هنوز تایید نشده، پس لیست را رفرش نمی‌کنیم
        alert("کامنت شما ارسال شد و پس از تایید نمایش داده خواهد شد.");
      } else {
        setError(data.error || "خطا در ارسال کامنت");
      }
    } catch (err) {
      setError("خطا در اتصال به سرور");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mt-12 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FaUser />
        نظرات کاربران
      </h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="mb-8">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="نظر خود را بنویسید..."
              className="flex-1 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              maxLength={2000}
            />
            <button
              onClick={submitComment}
              disabled={submitting || !newComment.trim()}
              className="px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
              ارسال
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {newComment.length}/2000 کاراکتر
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl text-center">
          <p className="text-gray-600">
            برای ارسال نظر ابتدا{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              وارد شوید
            </a>
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <FaSpinner
              className="animate-spin mx-auto text-gray-400"
              size={24}
            />
            <p className="text-gray-500 mt-2">در حال بارگذاری...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            هنوز نظری ثبت نشده است.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
