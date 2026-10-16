"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, X } from "lucide-react";

type Detection = { rawValue: string };
type Detector = { detect(video: HTMLVideoElement): Promise<Detection[]> };
type DetectorWindow = Window & { BarcodeDetector?: new (options?: { formats: string[] }) => Detector };

export default function TrackQrScanner({ onScan, onClose }: { onScan: (value: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState("در حال آماده‌سازی دوربین…");

  useEffect(() => {
    let stream: MediaStream | undefined;
    let timer: number | undefined;
    let detecting = false;
    let active = true;

    async function start() {
      const DetectorClass = (window as DetectorWindow).BarcodeDetector;
      if (!DetectorClass) {
        setMessage("اسکن QR در این مرورگر پشتیبانی نمی‌شود. کد پیگیری را در فرم صفحه وارد کنید.");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (!active) { stream.getTracks().forEach((track) => track.stop()); return; }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        const detector = new DetectorClass({ formats: ["qr_code"] });
        setMessage("کد QR را در کادر دوربین قرار دهید.");
        timer = window.setInterval(async () => {
          if (detecting || !videoRef.current || videoRef.current.readyState < 2) return;
          detecting = true;
          try {
            const results = await detector.detect(videoRef.current);
            if (results[0]?.rawValue && active) onScan(results[0].rawValue);
          } catch { /* Continue scanning while frames are unavailable. */ }
          finally { detecting = false; }
        }, 350);
      } catch {
        setMessage("دسترسی دوربین ممکن نشد. اجازه استفاده از دوربین را بررسی کنید یا کد را دستی وارد کنید.");
      }
    }
    void start();
    return () => {
      active = false;
      if (timer) window.clearInterval(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onScan]);

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" dir="rtl" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="qr-scanner-title" className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-[#0b2545] px-5 py-4 text-white">
        <div><h2 id="qr-scanner-title" className="font-black">اسکن QR تعمیر</h2><p className="mt-1 text-xs text-blue-100">کد روی لیبل تجهیز را مقابل دوربین بگیرید.</p></div>
        <button type="button" onClick={onClose} aria-label="بستن اسکنر" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><X size={18} /></button>
      </div>
      <div className="p-5">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-950">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-[14%] rounded-2xl border-2 border-cyan-300 shadow-[0_0_0_999px_rgba(2,6,23,.28)]" />
          <span className="absolute bottom-3 left-3 rounded-lg bg-black/55 p-2 text-white">{message.startsWith("اسکن") ? <Camera size={17} /> : <CameraOff size={17} />}</span>
        </div>
        <p role="status" className="mt-3 text-center text-sm leading-6 text-slate-600">{message}</p>
        <button type="button" onClick={onClose} className="mt-4 min-h-11 w-full rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50">بستن و ورود دستی کد</button>
      </div>
    </section>
  </div>;
}
