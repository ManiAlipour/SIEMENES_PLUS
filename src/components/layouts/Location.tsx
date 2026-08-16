"use client";

import { useEffect, useRef, useState } from "react";
import { FiMapPin, FiPhone, FiClock, FiNavigation, FiCopy, FiCheck } from "react-icons/fi";

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3219.575954852423!2d50.09012632451797!3d36.20119341332384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8cad00694365bb%3A0x7d9345082453edbd!2z2LLbjNmF2YbYsyDZvtmE2KfYsw!5e0!3m2!1sfa!2s!4v1781771002106!5m2!1sfa!2s";

export default function LocationSection() {
  const [copied, setCopied] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const addressText =
    "قزوین – شهر صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام، پلاک ۲۰";

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(addressText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = addressText;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const openDirections = () => {
    const destination = "36.201758,50.088333";
    const open = (origin?: string) => {
      const url = origin
        ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
      window.open(url, "_blank", "noopener,noreferrer");
    };

    if (!navigator.geolocation) {
      open();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => open(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => open(),
    );
  };

  return (
    <section
      className="bg-[#f3f5f7] py-16 md:py-20"
      aria-labelledby="location-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-xl md:mb-12">
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-primary">
            موقعیت
          </p>
          <h2
            id="location-heading"
            className="text-2xl font-black text-slate-900 md:text-3xl"
          >
            دفتر مرکزی زیمنس پلاس
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            برای مشاوره حضوری و بازدید از تجهیزات، مشتاق دیدار شما هستیم.
          </p>
        </header>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <FiMapPin className="h-5 w-5 text-primary" aria-hidden />
                <h3 className="text-base font-bold text-slate-900">آدرس</h3>
              </div>
              <p className="border-r-2 border-primary/30 pr-3 text-sm leading-7 text-slate-600 sm:text-base">
                {addressText}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300"
                >
                  {copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                  {copied ? "کپی شد" : "کپی آدرس"}
                </button>
                <button
                  type="button"
                  onClick={openDirections}
                  className="inline-flex items-center gap-2 border border-primary/25 bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/10"
                >
                  <FiNavigation />
                  مسیریابی
                </button>
              </div>

              <div className="my-7 h-px bg-slate-100" />

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <FiPhone className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">تماس</h4>
                    <p
                      dir="ltr"
                      className="mt-0.5 text-right font-mono text-sm text-slate-600"
                    >
                      09199883772
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiClock className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      ساعت کاری
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-600">
                      شنبه تا چهارشنبه ۸–۱۸ · پنج‌شنبه ۸–۱۴
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={mapRef}
            className="relative min-h-[360px] border border-slate-200 bg-slate-200 lg:col-span-7 lg:min-h-[480px]"
          >
            {showMap ? (
              <iframe
                title="موقعیت زیمنس پلاس روی نقشه"
                src={MAP_EMBED}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-slate-500">
                در حال آماده‌سازی نقشه…
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
