"use client";

/**
 * Admin contacts page: list messages from GET /api/contact;
 * view/reply in modal via PATCH /api/contact/[id].
 */
import { useEffect, useState, useCallback } from "react";
import type { Contact } from "./_components/types";
import MessageModal from "./_components/MessageModal";
import { MobileContactsList, DesktopContactsTable } from "./_components/ContactsTable";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [modalContact, setModalContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا در دریافت پیام‌ها");
      setContacts(data.data ?? []);
      setErr(null);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleShowMessage = useCallback((contact: Contact) => {
    setModalContact(contact);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setModalContact(null), 200);
  }, []);

  const handleReply = useCallback(async (answer: string) => {
    if (!modalContact) throw new Error("پیام پیدا نشد.");
    setReplyLoading(true);
    try {
      const res = await fetch(`/api/contact/${encodeURIComponent(modalContact.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.contact) {
        throw new Error(data?.error || "خطا در ثبت پاسخ.");
      }
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
  }, [modalContact]);

  return (
    <div className="p-3 sm:p-6">
      <h1 className="font-black text-lg sm:text-2xl mb-5 text-primary">
        پیام‌های تماس با ما
      </h1>

      {loading && (
        <div className="text-center text-gray-500 my-12">در حال بارگذاری...</div>
      )}
      {!loading && err && <div className="text-red-600 mb-4">{err}</div>}
      {!loading && !err && contacts.length === 0 && (
        <div className="text-gray-500">پیامی یافت نشد.</div>
      )}
      {!loading && !err && contacts.length > 0 && (
        <>
          <div className="block md:hidden">
            <MobileContactsList contacts={contacts} onShowMessage={handleShowMessage} />
          </div>
          <div className="hidden md:block">
            <DesktopContactsTable contacts={contacts} onShowMessage={handleShowMessage} />
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
