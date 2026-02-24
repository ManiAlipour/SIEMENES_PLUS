"use client";

import { useEffect, useState, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import {
  MdPerson,
  MdTitle,
  MdOutlineEmail,
  MdOutlineMessage,
  MdReply,
} from "react-icons/md";
import type { Contact } from "./types";

export type MessageModalProps = {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  onReply: (answer: string) => Promise<void>;
  replyLoading: boolean;
};

/**
 * Modal to view a contact message and optionally reply (when status is pending).
 * Handles escape/outside click to close and locks body scroll when open.
 */
export default function MessageModal({
  open,
  onClose,
  contact,
  onReply,
  replyLoading,
}: MessageModalProps) {
  const [answer, setAnswer] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form state when modal opens or contact changes; focus textarea after open
  useEffect(() => {
    if (open && contact) {
      setAnswer("");
      setErr(null);
      setSuccess(null);
      setTimeout(() => {
        const ta = modalRef.current?.querySelector("textarea");
        if (ta) (ta as HTMLTextAreaElement).focus();
      }, 200);
    }
  }, [open, contact]);

  // Close on Escape or click outside; lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onClickOutside(e: MouseEvent | TouchEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("touchstart", onClickOutside);
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("touchstart", onClickOutside);
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [open, onClose]);

  if (!open || !contact) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSuccess(null);
    if (!answer.trim()) {
      setErr("متن پاسخ نباید خالی باشد.");
      return;
    }
    try {
      await onReply(answer);
      setSuccess("پاسخ با موفقیت ثبت و ایمیل شد.");
    } catch (e: unknown) {
      setErr((e as Error)?.message ?? "خطا در ارسال پاسخ.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200"
      style={{ touchAction: "none" }}
      tabIndex={-1}
    >
      <div className="fixed inset-0 overflow-y-auto flex items-center justify-center sm:p-10 p-2 z-50">
        <div
          ref={modalRef}
          className="relative animate-fadeInTop bg-linear-to-br from-white/90 via-white/95 to-gray-100/90 rounded-2xl w-full max-w-lg border border-gray-200 ring-2 ring-primary/10 p-4 sm:p-8 flex flex-col gap-4 mx-auto shadow-xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-4rem)] overflow-y-auto"
          style={{ minHeight: "0" }}
        >
          <button
            onClick={onClose}
            className="absolute left-2 top-2 sm:left-4 sm:top-4 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center w-8 h-8 rounded-full transition-all ring-2 ring-transparent hover:ring-red-200 z-10"
            aria-label="بستن"
            type="button"
          >
            <IoIosClose className="w-7 h-7" />
          </button>
          <div className="flex items-center mb-2 gap-3">
            <div className="rounded-xl bg-primary/10 text-primary flex items-center justify-center w-10 h-10 shadow">
              <MdOutlineMessage className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-primary text-lg sm:text-xl mb-0.5">
                مشاهده پیام
              </div>
              <div className="text-xs text-gray-400">
                {new Date(contact.createdAt).toLocaleDateString("fa-IR")}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <MdPerson className="text-primary/60 w-5 h-5" />
              <span className="font-bold">نام:</span>
              <span>{contact.firstName + " " + contact.lastName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <MdOutlineEmail className="text-primary/60 w-5 h-5" />
              <span className="font-bold">ایمیل:</span>
              <span dir="ltr" className="break-all">{contact.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <MdTitle className="text-primary/60 w-5 h-5" />
              <span className="font-bold">عنوان:</span>
              <span className="break-all">{contact.title}</span>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-2 sm:px-4 py-2 sm:py-3 mt-3">
            <div className="flex items-center gap-2 text-primary font-bold mb-2 text-sm sm:text-base">
              <MdOutlineMessage className="w-4 h-4" />
              متن پیام:
            </div>
            <div className="whitespace-pre-line wrap-break-word text-gray-800 text-sm sm:text-base leading-relaxed">
              {contact.message}
            </div>
          </div>
          {contact.status === "pending" && (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 mt-3 rounded-xl p-2 sm:p-3 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <MdReply className="text-primary w-5 h-5" />
                <span className="font-bold text-sm">پاسخ به این پیام</span>
              </div>
              <textarea
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm"
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={replyLoading}
                placeholder="متن پاسخ..."
                required
                style={{ minHeight: 100, maxHeight: 180 }}
              />
              {err && <div className="text-xs text-red-500 mb-1">{err}</div>}
              {success && <div className="text-xs text-green-600 mb-1">{success}</div>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm shadow hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                  disabled={replyLoading}
                >
                  {replyLoading ? "در حال ارسال..." : (<><MdReply className="w-4 h-4" /> ارسال پاسخ</>)}
                </button>
              </div>
            </form>
          )}
          {contact.status === "answered" && contact.answer && (
            <div className="bg-green-50 border border-green-100 mt-3 rounded-xl px-2 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-2 text-sm sm:text-base">
                <MdReply className="w-4 h-4" />
                پاسخ ادمین:
              </div>
              <div className="whitespace-pre-line wrap-break-word text-green-800 text-sm sm:text-base leading-relaxed">
                {contact.answer}
              </div>
              <div className="text-xs text-gray-400 text-left mt-1">
                {contact.answeredAt && (
                  <>در تاریخ {new Date(contact.answeredAt).toLocaleDateString("fa-IR")}</>
                )}
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl bg-primary/90 text-white font-bold text-sm shadow hover:bg-primary transition-all active:scale-95"
              type="button"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInTop {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInTop {
          animation: fadeInTop 0.33s cubic-bezier(0.38, 1.34, 0.28, 1) both;
        }
      `}</style>
    </div>
  );
}
