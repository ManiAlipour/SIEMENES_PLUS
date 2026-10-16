"use client";

/**
 * Admin contacts page: list messages from GET /api/contact;
 * view/reply in modal via PATCH /api/contact/[id].
 */
import { useEffect, useState, useCallback, useMemo } from "react";
import type { Contact } from "./_components/types";
import MessageModal from "./_components/MessageModal";
import { MobileContactsList, DesktopContactsTable } from "./_components/ContactsTable";
import AdminPageHeading from "@/components/layouts/dash/admin/AdminPageHeading";
import { Mail, Search } from "lucide-react";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [modalContact, setModalContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "answered" | "closed">("all");

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

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa-IR");
    return contacts.filter((contact) => {
      const statusMatches = statusFilter === "all" || contact.status === statusFilter;
      const searchMatches = !query || `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.title} ${contact.message}`.toLocaleLowerCase("fa-IR").includes(query);
      return statusMatches && searchMatches;
    });
  }, [contacts, search, statusFilter]);

  return (
    <div dir="rtl" className="mx-auto max-w-[1440px] space-y-5">
      <AdminPageHeading title="پیام‌های مشتریان" description="درخواست‌ها و پیام‌های فرم تماس را بررسی و پاسخ دهید." icon={Mail} eyebrow="ارتباط با مشتریان" />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-400 focus-within:border-blue-400 focus-within:bg-white"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجو در نام، ایمیل، موضوع و متن پیام..." className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" /></label>
          <div className="flex flex-wrap rounded-xl bg-slate-100 p-1">{([["all", "همه"], ["pending", "در انتظار"], ["answered", "پاسخ‌داده‌شده"], ["closed", "بسته‌شده"]] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setStatusFilter(value)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${statusFilter === value ? "bg-white text-blue-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>)}</div>
        </div>
        <p className="mt-3 text-[11px] text-slate-500">{filteredContacts.length.toLocaleString("fa-IR")} پیام از {contacts.length.toLocaleString("fa-IR")} پیام</p>
      </section>

      {loading && (
        <div className="text-center text-gray-500 my-12">در حال بارگذاری...</div>
      )}
      {!loading && err && <div className="text-red-600 mb-4">{err}</div>}
      {!loading && !err && filteredContacts.length === 0 && (
        <div className="text-gray-500">پیامی یافت نشد.</div>
      )}
      {!loading && !err && filteredContacts.length > 0 && (
        <>
          <div className="block md:hidden">
            <MobileContactsList contacts={filteredContacts} onShowMessage={handleShowMessage} />
          </div>
          <div className="hidden md:block">
            <DesktopContactsTable contacts={filteredContacts} onShowMessage={handleShowMessage} />
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
