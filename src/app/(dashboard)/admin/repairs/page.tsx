"use client";
import { useEffect, useState } from "react";
const REPAIR_STAGES = [
  "RECEIVED",
  "INITIAL_INSPECTION",
  "REPAIRING",
  "TESTING",
  "READY_TO_DELIVER",
] as const;
const stages = [
  "دریافت تجهیز",
  "بررسی اولیه",
  "عیب‌یابی و تعمیر",
  "تست و تأیید عملکرد",
  "آماده ارسال",
];
const stageNames: Record<string, string> = Object.fromEntries(
  REPAIR_STAGES.map((key, i) => [key, stages[i]]),
);
type Order = {
  trackingToken: string;
  acceptanceNumber: string;
  deviceName: string;
  deviceModel: string;
  customerPhone: string;
  currentStage: string;
  lastUpdateNote?: string;
};

export default function RepairsAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({
    acceptanceNumber: "",
    deviceName: "",
    deviceModel: "",
    customerPhone: "",
  });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const load = async () => {
    const r = await fetch("/api/admin/repairs");
    const d = await r.json();
    if (r.ok) setOrders(d.data);
    else setMessage(d.error || "دریافت فهرست ناموفق بود.");
  };
  useEffect(() => {
    void load();
  }, []);
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const r = await fetch("/api/admin/repairs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    setMessage(
      r.ok
        ? `تعمیر ثبت شد. پیامک پذیرش: ${d.sms?.success ? "ارسال شد" : "ارسال نشد؛ تنظیمات پیامک را بررسی کنید"}`
        : d.message,
    );
    if (r.ok) {
      setForm({
        acceptanceNumber: "",
        deviceName: "",
        deviceModel: "",
        customerPhone: "",
      });
      await load();
    }
    setBusy(false);
  }
  async function update(order: Order, stage: string) {
    setBusy(true);
    const r = await fetch(`/api/admin/repairs/${order.trackingToken}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, note: notes[order.trackingToken] }),
    });
    const d = await r.json();
    setMessage(
      r.ok
        ? `مرحله بروزرسانی شد؛ پیامک: ${d.sms?.success ? "ارسال شد" : d.sms?.attempted ? "ارسال ناموفق" : "برای تغییر مرحله ارسال نشد"}`
        : d.message,
    );
    await load();
    setBusy(false);
  }
  async function upload(order: Order, type: "BEFORE" | "AFTER", file?: File) {
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("image", file);
    fd.set("type", type);
    const r = await fetch(`/api/admin/repairs/${order.trackingToken}`, {
      method: "POST",
      body: fd,
    });
    const d = await r.json();
    setMessage(r.ok ? "تصویر ذخیره شد." : d.message);
    await load();
    setBusy(false);
  }
  return (
    <main dir="rtl" className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold">پیگیری تعمیرات</h1>
        <p className="mt-1 text-sm text-gray-500">
          ثبت سفارش، بروزرسانی مراحل و تصاویر قابل مشاهده برای مشتری
        </p>
      </header>
      {message && (
        <p
          role="status"
          className="rounded-xl bg-blue-50 p-3 text-sm text-blue-900"
        >
          {message}
        </p>
      )}
      <form
        onSubmit={create}
        className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:grid-cols-2"
      >
        <h2 className="font-bold sm:col-span-2">ثبت تعمیر جدید</h2>
        {(
          [
            ["acceptanceNumber", "شماره پذیرش"],
            ["deviceName", "نام تجهیز"],
            ["deviceModel", "مدل / کد تجهیز"],
            ["customerPhone", "موبایل مشتری"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm">
            {label}
            <input
              required
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5"
            />
          </label>
        ))}
        <button
          disabled={busy}
          className="rounded-lg bg-blue-700 p-3 font-semibold text-white disabled:opacity-50 sm:col-span-2"
        >
          ثبت و ارسال پیامک پذیرش
        </button>
      </form>
      <section className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.trackingToken}
            className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">
                  {order.deviceName} · پذیرش {order.acceptanceNumber}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {order.deviceModel} · {order.customerPhone}
                </p>
              </div>
              <a
                className="text-sm font-semibold text-blue-700 underline"
                href={`/track/${order.trackingToken}`}
                target="_blank"
              >
                صفحه مشتری
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <select
                aria-label="مرحله تعمیر"
                value={order.currentStage}
                onChange={(e) => void update(order, e.target.value)}
                className="rounded-lg border p-2.5"
              >
                {REPAIR_STAGES.map((s, i) => (
                  <option key={s} value={s}>
                    {stages[i]}
                  </option>
                ))}
              </select>
              <input
                value={notes[order.trackingToken] ?? ""}
                onChange={(e) =>
                  setNotes({ ...notes, [order.trackingToken]: e.target.value })
                }
                placeholder="توضیح قابل نمایش برای مشتری"
                className="rounded-lg border p-2.5"
              />
              <button
                disabled={busy}
                onClick={() => void update(order, order.currentStage)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-white"
              >
                ثبت توضیح
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 border-t pt-3 text-sm">
              <a
                href={`/api/admin/repairs/${order.trackingToken}/qr`}
                target="_blank"
                className="font-semibold text-blue-700 underline"
              >
                بازکردن QR برای چاپ لیبل
              </a>
              <label className="cursor-pointer">
                عکس قبل
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) =>
                    void upload(order, "BEFORE", e.target.files?.[0])
                  }
                />
              </label>
              <label className="cursor-pointer">
                عکس بعد
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) =>
                    void upload(order, "AFTER", e.target.files?.[0])
                  }
                />
              </label>
              <span className="text-gray-500">
                {stageNames[order.currentStage]}
              </span>
            </div>
          </article>
        ))}
        {orders.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-gray-500">
            هنوز تعمیری ثبت نشده است.
          </p>
        )}
      </section>
    </main>
  );
}
