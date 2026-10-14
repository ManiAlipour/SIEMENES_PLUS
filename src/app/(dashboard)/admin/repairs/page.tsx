"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ClipboardCheck, ExternalLink, ImagePlus, LoaderCircle, Plus, QrCode, Search, Wrench } from "lucide-react";
import toast from "react-hot-toast";

const STAGES = [
  { key: "RECEIVED", label: "دریافت تجهیز", hint: "ثبت ورود به کارگاه" },
  { key: "INITIAL_INSPECTION", label: "بررسی اولیه", hint: "ارزیابی اولیه کارشناس" },
  { key: "REPAIRING", label: "عیب‌یابی و تعمیر", hint: "در حال بررسی و تعمیر" },
  { key: "TESTING", label: "تست و تأیید عملکرد", hint: "آزمایش پس از تعمیر" },
  { key: "READY_TO_DELIVER", label: "آماده ارسال", hint: "آماده تحویل به مشتری" },
] as const;
type Stage = (typeof STAGES)[number]["key"];
type Repair = { trackingToken: string; acceptanceNumber: string; deviceName: string; deviceModel: string; customerPhone: string; currentStage: Stage; lastUpdateNote?: string; lastUpdatedAt?: string; receivedAt?: string; images?: { type: "BEFORE" | "AFTER"; url: string }[] };
type Draft = { acceptanceNumber: string; deviceName: string; deviceModel: string; customerPhone: string };
const emptyDraft: Draft = { acceptanceNumber: "", deviceName: "", deviceModel: "", customerPhone: "" };
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

export default function RepairsAdminPage() {
  const [orders, setOrders] = useState<Repair[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [workingToken, setWorkingToken] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/repairs", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "دریافت فهرست تعمیرات ناموفق بود.");
      setOrders(result.data ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در دریافت اطلاعات");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return orders;
    return orders.filter((item) => [item.acceptanceNumber, item.deviceName, item.deviceModel, item.customerPhone].some((value) => value.toLocaleLowerCase().includes(term)));
  }, [orders, search]);

  async function createOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setCreating(true);
    try {
      const response = await fetch("/api/admin/repairs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "ثبت تعمیر انجام نشد.");
      toast.success(result.sms?.success ? "تعمیر ثبت شد و پیامک پذیرش ارسال شد." : "تعمیر ثبت شد؛ ارسال پیامک ناموفق بود.");
      setDraft(emptyDraft); await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : "ثبت تعمیر انجام نشد."); }
    finally { setCreating(false); }
  }

  async function updateOrder(order: Repair, stage: Stage, saveNote = false) {
    setWorkingToken(order.trackingToken);
    try {
      const response = await fetch(`/api/admin/repairs/${order.trackingToken}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage, note: notes[order.trackingToken] ?? (saveNote ? "" : undefined) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "به‌روزرسانی انجام نشد.");
      toast.success(result.sms?.success ? "وضعیت به‌روزرسانی و پیامک ارسال شد." : result.sms?.attempted ? "وضعیت به‌روزرسانی شد؛ ارسال پیامک ناموفق بود." : "وضعیت به‌روزرسانی شد.");
      await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : "به‌روزرسانی انجام نشد."); }
    finally { setWorkingToken(""); }
  }

  async function uploadImage(order: Repair, type: "BEFORE" | "AFTER", file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("لطفاً یک فایل تصویری انتخاب کنید."); return; }
    setWorkingToken(order.trackingToken);
    try {
      const data = new FormData(); data.set("image", file); data.set("type", type);
      const response = await fetch(`/api/admin/repairs/${order.trackingToken}`, { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "بارگذاری تصویر انجام نشد.");
      toast.success(type === "BEFORE" ? "تصویر قبل از تعمیر ثبت شد." : "تصویر پس از تعمیر ثبت شد."); await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : "بارگذاری تصویر انجام نشد."); }
    finally { setWorkingToken(""); }
  }

  const stageLabel = (stage: Stage) => STAGES.find((item) => item.key === stage)?.label ?? stage;

  return <main dir="rtl" className="mx-auto max-w-7xl space-y-6 pb-10">
    <header className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0b2545] via-[#123d68] to-[#0878ae] p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8">
      <div className="absolute -left-10 -top-16 h-56 w-56 rounded-full border-[35px] border-white/5" />
      <div className="relative flex flex-wrap items-end justify-between gap-5"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-cyan-100"><Wrench size={14} /> مدیریت خدمات</div><h1 className="text-2xl font-black tracking-tight sm:text-3xl">پیگیری تعمیرات</h1><p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/80">سفارش تعمیر را ثبت کنید، روند کارگاه را به‌روزرسانی کنید و QR اختصاصی هر تجهیز را برای چاپ لیبل دریافت کنید.</p></div><div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-center backdrop-blur"><div className="text-2xl font-black">{orders.length.toLocaleString("fa-IR")}</div><div className="mt-1 text-[11px] text-blue-100">سفارش ثبت‌شده</div></div></div>
    </header>

    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Plus size={19} /></span><div><h2 className="font-extrabold text-slate-900">ثبت تعمیر جدید</h2><p className="mt-1 text-xs text-slate-500">پس از ثبت، لینک پیگیری اختصاصی و QR ساخته می‌شود.</p></div></div>
        <form onSubmit={createOrder} className="grid gap-3 sm:grid-cols-2">
          {([["acceptanceNumber", "شماره پذیرش", "مثلاً ۱۴۰۵-۱۰۲۵"], ["deviceName", "نام تجهیز", "مثلاً درایو SINAMICS 611"], ["deviceModel", "مدل / کد تجهیز", "کد فنی دستگاه"], ["customerPhone", "شماره موبایل مشتری", "09xxxxxxxxx"]] as const).map(([key, label, placeholder]) => <label key={key} className="space-y-1.5 text-xs font-bold text-slate-600">{label}<input className={inputClass} required value={draft[key]} onChange={(event) => setDraft((previous) => ({ ...previous, [key]: event.target.value }))} placeholder={placeholder} /></label>)}
          <button type="submit" disabled={creating} className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60 sm:col-span-2">{creating ? <LoaderCircle size={17} className="animate-spin" /> : <ClipboardCheck size={17} />}ثبت پذیرش و ارسال پیامک</button>
        </form>
      </div>
      <aside className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-extrabold text-slate-900">روند استاندارد تعمیر</h2><div className="mt-5 space-y-4">{STAGES.map((stage, index) => <div className="flex items-start gap-3" key={stage.key}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${index === 0 ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500"}`}>{(index + 1).toLocaleString("fa-IR")}</span><div><p className="text-sm font-bold text-slate-800">{stage.label}</p><p className="mt-0.5 text-[11px] text-slate-500">{stage.hint}</p></div></div>)}</div></aside>
    </section>

    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-black text-slate-900">سفارش‌های تعمیر</h2><p className="mt-1 text-xs text-slate-500">وضعیت و تصاویر قابل مشاهده برای مشتری را مدیریت کنید.</p></div><label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 shadow-sm sm:w-72"><Search size={16} /><input className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="جستجو در پذیرش‌ها..." value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
      {loading ? <div className="flex min-h-44 items-center justify-center gap-2 rounded-2xl bg-white text-sm text-slate-500"><LoaderCircle className="animate-spin" size={18} />در حال دریافت سفارش‌ها...</div> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">{search ? "موردی با این عبارت پیدا نشد." : "هنوز سفارشی ثبت نشده است."}</div> : <div className="grid gap-4">{filtered.map((order) => <article key={order.trackingToken} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-4 sm:p-5"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold text-slate-900">{order.deviceName}</h3><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">پذیرش {order.acceptanceNumber}</span></div><p className="mt-2 text-xs text-slate-500">مدل: {order.deviceModel} <span className="mx-1 text-slate-300">·</span> {order.customerPhone} <span className="mx-1 text-slate-300">·</span> پذیرش {order.receivedAt ? new Date(order.receivedAt).toLocaleDateString("fa-IR") : "—"}</p></div><a href={`/track/${order.trackingToken}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-700">صفحه مشتری<ExternalLink size={13} /></a></div>
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_320px]"><div><div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold text-slate-500">مرحله فعلی</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">{stageLabel(order.currentStage)}</span></div><div className="grid grid-cols-5 gap-1">{STAGES.map((stage) => { const active = stage.key === order.currentStage; return <div key={stage.key} className={`h-1.5 rounded-full ${active ? "bg-blue-600" : STAGES.findIndex((item) => item.key === stage.key) < STAGES.findIndex((item) => item.key === order.currentStage) ? "bg-emerald-400" : "bg-slate-100"}`} />; })}</div><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><select aria-label="مرحله تعمیر" value={order.currentStage} onChange={(event) => void updateOrder(order, event.target.value as Stage)} disabled={workingToken === order.trackingToken} className={inputClass}>{STAGES.map((stage) => <option key={stage.key} value={stage.key}>{stage.label}</option>)}</select><input className={inputClass} value={notes[order.trackingToken] ?? ""} onChange={(event) => setNotes((previous) => ({ ...previous, [order.trackingToken]: event.target.value }))} placeholder="توضیح قابل مشاهده برای مشتری" /><button type="button" disabled={workingToken === order.trackingToken} onClick={() => void updateOrder(order, order.currentStage, true)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-700 disabled:opacity-50">{workingToken === order.trackingToken ? <LoaderCircle size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}ثبت</button></div><p className="mt-2 text-[11px] text-slate-400">آخرین بروزرسانی: {order.lastUpdatedAt ? new Date(order.lastUpdatedAt).toLocaleString("fa-IR") : "—"}{order.lastUpdateNote ? ` · ${order.lastUpdateNote}` : ""}</p></div>
          <div className="flex flex-col justify-between gap-3 rounded-xl bg-slate-50 p-3"><a href={`/api/admin/repairs/${order.trackingToken}/qr`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"><QrCode size={16} />دریافت QR برای لیبل</a><div className="grid grid-cols-2 gap-2">{([ ["BEFORE", "تصویر قبل"], ["AFTER", "تصویر بعد"] ] as const).map(([type, title]) => <label key={type} className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-white px-2 py-2 text-[11px] font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-700"><ImagePlus size={15} />{title}<input type="file" accept="image/*" className="sr-only" disabled={workingToken === order.trackingToken} onChange={(event) => { void uploadImage(order, type, event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>)}</div><div className="flex gap-2">{order.images?.map((image, index) => <a key={`${image.type}-${index}`} href={image.url} target="_blank" rel="noreferrer" className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200"><img src={image.url} alt={image.type === "BEFORE" ? "تصویر پیش از تعمیر" : "تصویر پس از تعمیر"} className="h-full w-full object-cover" /></a>)}</div></div>
        </div>
      </article>)}</div>}
    </section>
  </main>;
}
