"use client";

import { useState } from "react";
import { Check, Copy, Download, ExternalLink, QrCode, Share2, X } from "lucide-react";
import toast from "react-hot-toast";

type Props = { token: string; acceptanceNumber: string; admin?: boolean; onClose?: () => void };

export default function RepairQrTools({ token, acceptanceNumber, admin = false, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const qrPath = admin ? `/api/admin/repairs/${token}/qr` : `/api/track/${token}/qr`;
  const trackPath = `/track/${encodeURIComponent(token)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(new URL(trackPath, window.location.origin).toString());
      setCopied(true);
      toast.success("لینک پیگیری کپی شد");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("کپی لینک انجام نشد");
    }
  }

  async function share() {
    const url = new URL(trackPath, window.location.origin).toString();
    if (navigator.share) {
      try {
        const response = await fetch(qrPath);
        if (!response.ok) throw new Error("QR unavailable");
        const file = new File([await response.blob()], `repair-${acceptanceNumber}.png`, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `پیگیری تعمیر ${acceptanceNumber}`, text: "لینک پیگیری تعمیر", url, files: [file] });
        } else {
          await navigator.share({ title: `پیگیری تعمیر ${acceptanceNumber}`, text: "لینک پیگیری تعمیر", url });
        }
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  const content = (
    <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl" dir="rtl">
      {onClose && <button type="button" onClick={onClose} aria-label="بستن" className="absolute left-4 top-4 z-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><X size={18} /></button>}
      <div className="bg-gradient-to-l from-[#0b2545] to-[#0878ae] px-6 py-5 text-white sm:px-7">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-cyan-100"><QrCode size={16} /> QR اختصاصی تعمیر</span>
        <h2 className="mt-2 text-xl font-black">نمایش و اشتراک کد پیگیری</h2>
        <p className="mt-1 text-sm text-blue-100">با اسکن این کد، صفحه همین تعمیر مستقیماً باز می‌شود.</p>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-[200px_1fr] sm:items-center sm:p-7">
        <div className="mx-auto rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
          <img src={qrPath} alt={`QR پیگیری تعمیر ${acceptanceNumber}`} width={176} height={176} className="block h-44 w-44" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">شماره پذیرش</p>
          <p dir="ltr" className="mt-1 w-fit rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-sm font-bold text-slate-800">{acceptanceNumber}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`${qrPath}?download=1`} download={`repair-${acceptanceNumber}.png`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800"><Download size={16} />دانلود PNG</a>
            <button type="button" onClick={() => void share()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700"><Share2 size={16} />اشتراک‌گذاری</button>
            <button type="button" onClick={() => void copyLink()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "کپی شد" : "کپی لینک"}</button>
          </div>
          <a href={trackPath} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900">پیش‌نمایش صفحه پیگیری <ExternalLink size={13} /></a>
        </div>
      </div>
      <p className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] leading-5 text-slate-500">برای چاپ لیبل، فایل PNG را با اندازه واقعی و بدون برش چاپ کنید.</p>
    </div>
  );

  if (onClose) return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>{content}</div>;
  return content;
}
