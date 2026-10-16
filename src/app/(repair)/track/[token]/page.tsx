import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import RepairOrder, { REPAIR_STAGES } from "@/models/RepairOrder";
import RepairQrTools from "@/components/repair/RepairQrTools";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleHelp,
  Clock3,
  Image as ImageIcon,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "پیگیری وضعیت تجهیز | زیمنس پلاس",
  description: "مشاهده روند تعمیر تجهیز از طریق لینک اختصاصی زیمنس پلاس.",
  robots: { index: false, follow: false },
};

const STAGES: Record<string, { title: string; short: string }> = {
  RECEIVED: { title: "دریافت تجهیز", short: "دریافت" },
  INITIAL_INSPECTION: { title: "بررسی اولیه", short: "بررسی" },
  REPAIRING: { title: "عیب‌یابی و تعمیر", short: "تعمیر" },
  TESTING: { title: "تست و تأیید عملکرد", short: "تست" },
  READY_TO_DELIVER: { title: "آماده ارسال", short: "ارسال" },
};

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Tehran",
  }).format(new Date(date));
}

export default async function TrackRepairPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  await connectDB();
  const order = await RepairOrder.findOne({ trackingToken: token }).lean();
  if (!order) notFound();

  const currentIndex = REPAIR_STAGES.indexOf(order.currentStage);
  const progress = Math.round(((currentIndex + 1) / REPAIR_STAGES.length) * 100);
  const logs = [...(order.stageLogs ?? [])].sort(
    (a: any, b: any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
  );
  const images = order.images ?? [];
  const beforeImages = images.filter((image: any) => image.type === "BEFORE");
  const afterImages = images.filter((image: any) => image.type === "AFTER");

  return (
    <main dir="rtl" className="min-h-screen bg-[#f3f6fb] pb-8 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-5 sm:px-6 sm:pt-8">
        <header className="mb-5 flex items-center justify-between gap-3 sm:mb-7">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b2c53] text-white shadow-sm transition group-hover:bg-blue-800">
              <Wrench size={19} />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-slate-900">زیمنس پلاس</span>
              <span className="block text-[11px] text-slate-500">مرکز تخصصی تعمیرات</span>
            </span>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
            <ShieldCheck size={15} /> لینک اختصاصی شما
          </span>
        </header>

        <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#071b36] via-[#0b315c] to-[#075b91] p-5 text-white shadow-xl shadow-blue-950/10 sm:rounded-[2rem] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-12 -top-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium text-blue-100">پیگیری وضعیت تجهیز</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-blue-50">
                پذیرش <b dir="ltr" className="mr-1 font-bold text-white">{order.acceptanceNumber}</b>
              </span>
            </div>

            <div className="mt-6 grid gap-7 md:grid-cols-[1fr_230px] md:items-end">
              <div>
                <p className="text-xs text-blue-200">تجهیز شما</p>
                <h1 className="mt-1 text-2xl font-black leading-9 sm:text-3xl">{order.deviceName}</h1>
                <p dir="ltr" className="mt-1.5 w-fit rounded-lg bg-white/10 px-2.5 py-1 font-mono text-sm text-blue-100">
                  {order.deviceModel}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-3.5 py-2 text-sm font-extrabold text-slate-950 shadow-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-700" />
                    {STAGES[order.currentStage]?.title ?? "در حال بررسی"}
                  </span>
                  <span className="text-xs text-blue-100">مرحله {Math.max(currentIndex + 1, 1)} از {REPAIR_STAGES.length}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 md:p-5">
                <div className="flex items-center justify-between text-xs text-blue-100">
                  <span>پیشرفت تعمیر</span><span className="font-bold text-white">{progress}٪</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="پیشرفت تعمیر" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                  <div className="h-full rounded-full bg-gradient-to-l from-cyan-300 to-emerald-300 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] leading-5 text-blue-100/90">
                  <Clock3 size={13} /> آخرین بروزرسانی: {formatDate(order.lastUpdatedAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5" aria-label="QR و لینک پیگیری">
          <RepairQrTools token={token} acceptanceNumber={order.acceptanceNumber} />
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,.8fr)]">
          <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="timeline-title">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-blue-700">گام‌به‌گام</p>
                <h2 id="timeline-title" className="mt-1 text-lg font-black">روند تعمیر</h2>
              </div>
              <span className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">{REPAIR_STAGES.length} مرحله</span>
            </div>
            <ol className="space-y-0">
              {REPAIR_STAGES.map((stage, index) => {
                const log = [...logs].reverse().find((entry: any) => entry.stage === stage);
                const done = index < currentIndex;
                const active = index === currentIndex;
                return (
                  <li key={stage} className="relative flex gap-3.5 pb-6 last:pb-0 sm:gap-4">
                    <div className="relative flex w-8 shrink-0 justify-center">
                      {index < REPAIR_STAGES.length - 1 && <span className={`absolute top-8 bottom-[-1.5rem] w-0.5 ${done ? "bg-emerald-300" : "bg-slate-100"}`} />}
                      <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${done ? "bg-emerald-100 text-emerald-700" : active ? "bg-blue-700 text-white shadow-md shadow-blue-700/25" : "bg-slate-100 text-slate-400"}`}>
                        {done ? <Check size={16} strokeWidth={3} /> : active ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                      </span>
                    </div>
                    <div className={`min-w-0 flex-1 rounded-2xl px-3.5 py-3 transition-colors ${active ? "border border-blue-100 bg-blue-50/70" : "border border-transparent"}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className={`text-sm font-extrabold ${done ? "text-emerald-800" : active ? "text-blue-900" : "text-slate-400"}`}>{STAGES[stage]?.title}</h3>
                        {active && <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-800">مرحله فعلی</span>}
                        {done && <span className="text-[10px] font-semibold text-emerald-700">تکمیل‌شده</span>}
                      </div>
                      {log ? (
                        <>
                          <p className={`mt-2 text-sm leading-6 ${active || done ? "text-slate-600" : "text-slate-400"}`}>{log.description}</p>
                          <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-400"><Clock3 size={12} />{formatDate(log.updatedAt)}</p>
                        </>
                      ) : !active && <p className="mt-1.5 text-xs text-slate-400">در انتظار رسیدن به این مرحله</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="device-info-title">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Wrench size={18} /></span>
                <div><p className="text-xs text-slate-500">اطلاعات پذیرش</p><h2 id="device-info-title" className="font-black">مشخصات تجهیز</h2></div>
              </div>
              <dl className="mt-5 divide-y divide-slate-100">
                <InfoRow label="شماره پذیرش" value={order.acceptanceNumber} ltr />
                <InfoRow label="نام تجهیز" value={order.deviceName} />
                <InfoRow label="مدل / کد فنی" value={order.deviceModel} ltr />
                <InfoRow label="تاریخ پذیرش" value={formatDate(order.receivedAt)} />
              </dl>
            </section>

            <section className="rounded-[1.5rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm sm:p-6" aria-labelledby="last-update-title">
              <div className="flex items-center gap-2 text-amber-800"><Clock3 size={17} /><h2 id="last-update-title" className="text-sm font-black">آخرین بروزرسانی</h2></div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{order.lastUpdateNote || "وضعیت تعمیر تجهیز بروزرسانی شد."}</p>
              <p className="mt-3 border-t border-amber-200/70 pt-3 text-xs text-slate-500">{formatDate(order.lastUpdatedAt)}</p>
            </section>

            <a href="tel:09129637779" className="group flex items-center justify-between gap-3 rounded-[1.5rem] bg-emerald-700 p-4 text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 sm:p-5">
              <span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Phone size={19} /></span><span><span className="block text-xs text-emerald-100">پرسشی دارید؟ با ما تماس بگیرید</span><span className="mt-1 block font-extrabold">۰۹۱۲۹۶۳۷۷۷۹</span></span></span>
              <ArrowRight size={18} className="rotate-180 transition-transform group-hover:-translate-x-1" />
            </a>
          </aside>
        </div>

        <section className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="photos-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><ImageIcon size={18} /></span><div><h2 id="photos-title" className="font-black">تصاویر تجهیز</h2><p className="mt-0.5 text-xs text-slate-500">گزارش تصویری قبل و بعد از تعمیر</p></div></div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{images.length.toLocaleString("fa-IR")} تصویر</span>
          </div>
          {images.length ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <PhotoGroup title="قبل از تعمیر" items={beforeImages} />
              <PhotoGroup title="بعد از تعمیر" items={afterImages} />
            </div>
          ) : (
            <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm"><ImageIcon size={21} /></span>
              <p className="mt-3 text-sm font-bold text-slate-700">هنوز تصویری برای این تجهیز ثبت نشده است</p>
              <p className="mt-1 max-w-sm text-xs leading-6 text-slate-500">اگر تصویری از وضعیت قبل یا بعد تعمیر ثبت شود، از همین بخش قابل مشاهده خواهد بود.</p>
            </div>
          )}
        </section>

        <footer className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl px-2 py-3 text-center sm:flex-row sm:text-right">
          <p className="flex items-center gap-1.5 text-xs leading-6 text-slate-500"><BadgeCheck size={15} className="shrink-0 text-emerald-600" />این صفحه فقط با لینک اختصاصی یا QR همین تعمیر باز می‌شود.</p>
          <Link href="/track" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"><CircleHelp size={15} /> راهنمای پیگیری <ArrowRight size={14} className="rotate-180" /></Link>
        </footer>
      </div>
    </main>
  );
}

function InfoRow({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) {
  return <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"><dt className="shrink-0 text-xs text-slate-500">{label}</dt><dd dir={ltr ? "ltr" : undefined} className={`min-w-0 text-left text-xs font-bold leading-6 text-slate-800 ${ltr ? "font-mono" : ""}`}>{value}</dd></div>;
}

function PhotoGroup({ title, items }: { title: string; items: any[] }) {
  return <div><h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"><span className={`h-2 w-2 rounded-full ${title.startsWith("قبل") ? "bg-amber-400" : "bg-emerald-500"}`} />{title}</h3>
    {items.length ? <div className="grid grid-cols-2 gap-2">{items.map((image, index) => <a key={`${image.url}-${index}`} href={image.url} target="_blank" rel="noreferrer" className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"><Image src={image.url} alt={`${title} ${index + 1}`} fill unoptimized sizes="(max-width: 640px) 45vw, 300px" className="object-cover transition duration-300 group-hover:scale-105" /><span className="absolute bottom-2 left-2 rounded-lg bg-black/55 px-2 py-1 text-[10px] text-white">مشاهده تصویر</span></a>)}</div> : <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 text-center text-xs text-slate-400">تصویر {title} ثبت نشده</div>}
  </div>;
}
