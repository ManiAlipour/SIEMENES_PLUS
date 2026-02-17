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

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
};

// ==== Modal with Answer Form ====
function MessageModal({
  open,
  onClose,
  contact,
  onReply,
  replyLoading,
}: {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  onReply: (answer: string) => Promise<void>;
  replyLoading: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // reset state on modal open/contact change
  useEffect(() => {
    if (open && contact) {
      setAnswer("");
      setErr(null);
      setSuccess(null);
      // optional, focus textarea if present
      setTimeout(() => {
        if (modalRef.current) {
          const ta = modalRef.current.querySelector("textarea");
          if (ta) (ta as HTMLTextAreaElement).focus();
        }
      }, 200);
    }
  }, [open, contact]);

  // close on escape or outside click; disable page scroll when open
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
    // handle scroll/overscroll mob/desktop
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
    } catch (e: any) {
      setErr(e?.message ?? "خطا در ارسال پاسخ.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200"
      style={{ touchAction: "none" }}
      tabIndex={-1}
    >
      {/* Scrollable modal for both desktop & mobile */}
      <div className="fixed inset-0 overflow-y-auto flex items-center justify-center sm:p-10 p-2 z-50">
        <div
          ref={modalRef}
          className="relative animate-fadeInTop bg-gradient-to-br from-white/90 via-white/95 to-gray-100/90 rounded-2xl w-full max-w-lg border border-gray-200 ring-2 ring-primary/10 p-4 sm:p-8 flex flex-col gap-4 mx-auto shadow-xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-4rem)] overflow-y-auto"
          style={{
            // Prevent modal height from getting larger than viewport on mobile
            minHeight: "0",
          }}
        >
          <button
            onClick={onClose}
            className="absolute left-2 top-2 sm:left-4 sm:top-4 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center w-8 h-8 rounded-full transition-all ring-2 ring-transparent hover:ring-red-200 z-10"
            aria-label="بستن"
            type="button"
          >
            <IoIosClose className="w-7 h-7 " />
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
              <span dir="ltr" className="break-all">
                {contact.email}
              </span>
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
            <div className="whitespace-pre-line break-words text-gray-800 text-sm sm:text-base leading-relaxed">
              {contact.message}
            </div>
          </div>
          {/* Reply button - when message is pending */}
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
              {success && (
                <div className="text-xs text-green-600 mb-1">{success}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm shadow hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                  disabled={replyLoading}
                >
                  {replyLoading ? (
                    "در حال ارسال..."
                  ) : (
                    <>
                      <MdReply className="w-4 h-4" />
                      ارسال پاسخ
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          {/* When reply already sent */}
          {contact.status === "answered" && contact.answer && (
            <div className="bg-green-50 border border-green-100 mt-3 rounded-xl px-2 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-2 text-sm sm:text-base">
                <MdReply className="w-4 h-4" />
                پاسخ ادمین:
              </div>
              <div className="whitespace-pre-line break-words text-green-800 text-sm sm:text-base leading-relaxed">
                {contact.answer}
              </div>
              <div className="text-xs text-gray-400 text-left mt-1">
                {contact.answeredAt && (
                  <>
                    در تاریخ{" "}
                    {new Date(contact.answeredAt).toLocaleDateString("fa-IR")}
                  </>
                )}
              </div>
            </div>
          )}
          {/* Close button */}
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
          0% {
            opacity: 0;
            transform: translateY(-40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInTop {
          animation: fadeInTop 0.33s cubic-bezier(0.38, 1.34, 0.28, 1) both;
        }
      `}</style>
    </div>
  );
}

function MobileTable({
  contacts,
  onShowMessage,
}: {
  contacts: Contact[];
  onShowMessage: (contact: Contact) => void;
}) {
  // Proper scroll and tap targets for mobile
  return (
    <div className="flex flex-col gap-3">
      {contacts.map((contact, index) => (
        <div
          key={contact.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2"
          style={{ minWidth: 0 }}
        >
          <div className="flex items-center gap-2 text-gray-700 text-base font-bold mb-1">
            <MdPerson className="text-primary/60 w-5 h-5 shrink-0" />
            <span className="truncate">
              {contact.firstName + " " + contact.lastName}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 min-w-0 truncate">
            <MdOutlineEmail className="w-4 h-4 text-primary/60 shrink-0" />
            <span dir="ltr" className="break-all truncate">
              {contact.email}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 min-w-0 truncate">
            <MdTitle className="w-4 h-4 text-primary/60 shrink-0" />
            <span className="font-bold shrink-0">عنوان:</span>
            <span className="break-all truncate">{contact.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={
                "px-2 py-0.5 rounded-xl text-xs font-bold whitespace-nowrap " +
                (contact.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : contact.status === "answered"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500")
              }
            >
              {contact.status === "pending"
                ? "در انتظار پاسخ"
                : contact.status === "answered"
                ? "پاسخ داده شده"
                : "بسته شده"}
            </span>
            <span className="text-xxs text-gray-400 ml-auto rtl:ml-0 rtl:mr-auto whitespace-nowrap">
              {new Date(contact.createdAt).toLocaleDateString("fa-IR")}
            </span>
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="text-primary hover:underline text-xs font-bold px-2 py-1 rounded-lg focus:outline-none"
              onClick={() => onShowMessage(contact)}
              type="button"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              مشاهده پیام
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopTable({
  contacts,
  onShowMessage,
}: {
  contacts: Contact[];
  onShowMessage: (contact: Contact) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow px-2 pb-2">
      <table className="w-full text-sm text-right border-separate border-spacing-y-2">
        <thead>
          <tr className="text-xs text-gray-500 bg-gray-50">
            <th className="px-3 py-2 rounded-tr-xl">نام</th>
            <th className="px-3 py-2">ایمیل</th>
            <th className="px-3 py-2">عنوان</th>
            <th className="px-3 py-2">وضعیت</th>
            <th className="px-3 py-2">تاریخ</th>
            <th className="px-3 py-2 rounded-tl-xl">جزییات</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="bg-white hover:bg-gray-50 transition">
              <td className="px-3 py-2 font-semibold">
                {contact.firstName + " " + contact.lastName}
              </td>
              <td className="px-3 py-2">{contact.email}</td>
              <td className="px-3 py-2">{contact.title}</td>
              <td className="px-3 py-2">
                <span
                  className={
                    "px-2 py-0.5 rounded-xl text-xs font-bold " +
                    (contact.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : contact.status === "answered"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500")
                  }
                >
                  {contact.status === "pending"
                    ? "در انتظار پاسخ"
                    : contact.status === "answered"
                    ? "پاسخ داده شده"
                    : "بسته شده"}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 ltr:text-left rtl:text-right">
                {new Date(contact.createdAt).toLocaleDateString("fa-IR")}
              </td>
              <td className="px-3 py-2">
                <button
                  className="text-primary hover:underline text-xs font-bold"
                  onClick={() => onShowMessage(contact)}
                  type="button"
                >
                  مشاهده پیام
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [modalContact, setModalContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      try {
        const res = await fetch("/api/contact", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "خطا در دریافت پیام‌ها");
        setContacts(data.data ?? []);
        setErr(null);
      } catch (e: any) {
        setErr(e.message);
      }
      setLoading(false);
    }
    fetchContacts();
  }, []);

  const handleShowMessage = (contact: Contact) => {
    setModalContact(contact);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalContact(null), 200);
  };

  const handleReply = async (answer: string) => {
    if (!modalContact) throw new Error("پیام پیدا نشد.");
    setReplyLoading(true);
    try {
      console.log(`/api/contact/${encodeURIComponent(modalContact.id)}`);

      const res = await fetch(
        `/api/contact/${encodeURIComponent(modalContact.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer }),
        }
      );
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("پاسخ سرور نامعتبر است.");
      }
      if (!res.ok || !data?.contact)
        throw new Error(data?.error || "خطا در ثبت پاسخ.");
      setContacts((prev) =>
        prev.map((item) =>
          item.id === modalContact.id
            ? {
                ...item,
                status: "answered",
                answer: data.contact.answer,
                answeredAt: data.contact.answeredAt,
              }
            : item
        )
      );
      setModalContact((prev) =>
        prev
          ? {
              ...prev,
              status: "answered",
              answer: data.contact.answer,
              answeredAt: data.contact.answeredAt,
            }
          : prev
      );
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <h1 className="font-black text-lg sm:text-2xl mb-5 text-primary">
        پیام‌های تماس با ما
      </h1>
      {loading ? (
        <div className="text-center text-gray-500 my-12">
          در حال بارگذاری...
        </div>
      ) : err ? (
        <div className="text-red-600 mb-4">{err}</div>
      ) : contacts.length === 0 ? (
        <div className="text-gray-500">پیامی یافت نشد.</div>
      ) : (
        <>
          {/* Mobile, show cards, hidden on md+ */}
          <div className="block md:hidden">
            <MobileTable
              contacts={contacts}
              onShowMessage={handleShowMessage}
            />
          </div>
          {/* Desktop, show table */}
          <div className="hidden md:block">
            <DesktopTable
              contacts={contacts}
              onShowMessage={handleShowMessage}
            />
          </div>
        </>
      )}
      <MessageModal
        open={modalOpen}
        onClose={closeModal}
        contact={modalContact}
        onReply={handleReply}
        replyLoading={replyLoading}
      />
    </div>
  );
}
