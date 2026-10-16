"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, ScanQrCode, Search } from "lucide-react";
import TrackQrScanner from "./TrackQrScanner";

export default function TrackLookupForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleScan = useCallback((rawValue: string) => {
    const pastedUrl = rawValue.match(/\/track\/([a-zA-Z0-9_-]+)/);
    const token = (pastedUrl?.[1] || rawValue.trim()).replace(/\s/g, "");
    if (!/^[a-zA-Z0-9_-]{8,80}$/.test(token)) {
      setError("کد QR معتبر نیست؛ کد پیگیری را دستی وارد کنید.");
      setScannerOpen(false);
      return;
    }
    setError("");
    setScannerOpen(false);
    router.push(`/track/${encodeURIComponent(token)}`);
  }, [router]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = code.trim();
    if (!value) { setError("کد پیگیری اختصاصی را وارد کنید."); return; }
    const pastedUrl = value.match(/\/track\/([a-zA-Z0-9_-]+)/);
    const token = pastedUrl?.[1] || value;
    if (!/^[a-zA-Z0-9_-]{8,80}$/.test(token)) { setError("کد پیگیری یا لینک واردشده معتبر نیست."); return; }
    setError("");
    router.push(`/track/${encodeURIComponent(token)}`);
  }

  return <>
  <form onSubmit={submit} className="mt-7 space-y-3">
    <label htmlFor="tracking-code" className="block text-sm font-semibold text-slate-700">کد پیگیری اختصاصی</label>
    <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
      <Search className="m-3 shrink-0 text-slate-400" size={19} />
      <input id="tracking-code" dir="ltr" autoComplete="off" inputMode="text" value={code} onChange={(event) => setCode(event.target.value)} placeholder="مثلاً کد موجود در لینک پیامک" className="min-w-0 flex-1 bg-transparent text-left text-sm outline-none placeholder:text-slate-400" />
      <button type="submit" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200">پیگیری <ArrowLeft size={16} /></button>
    </div>
    <p role="alert" className="min-h-5 text-sm text-rose-600">{error}</p>
    <button type="button" onClick={() => setScannerOpen(true)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"><Camera size={17} />اسکن QR با دوربین</button>
    <p className="flex items-center gap-2 text-xs leading-6 text-slate-500"><ScanQrCode size={16} className="shrink-0 text-blue-600" />با اسکن QR روی لیبل تعمیر، صفحه همان تجهیز مستقیماً باز می‌شود.</p>
  </form>
  {scannerOpen && <TrackQrScanner onScan={handleScan} onClose={() => setScannerOpen(false)} />}
  </>;
}
