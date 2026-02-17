"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

type Accent = "cyan" | "emerald" | "amber";

type Slide = {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  accent: Accent;
};

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: "Industrial Automation",
    title: "هوشمندی واقعی در",
    highlight: "اتوماسیون صنعتی",
    description:
      "کنترل دقیق خطوط تولید با تجهیزات اورجینال زیمنس. پایدار، سریع و قابل‌اعتماد.",
    image: "/images/hero-industrial-solder.jpg",
    accent: "cyan",
  },
  {
    id: 2,
    tag: "Drive Technology",
    title: "کنترل بی‌نقص",
    highlight: "سیستم‌های محرکه",
    description:
      "درایوهای SINAMICS با راندمان بالا و عملکرد پایدار برای صنایع سنگین.",
    image: "/images/section-one-image.jpg",
    accent: "emerald",
  },
  {
    id: 3,
    tag: "Technical Support",
    title: "پشتیبانی مهندسی",
    highlight: "در تمام مسیر",
    description:
      "از انتخاب تجهیز تا راه‌اندازی و تعمیرات تخصصی در کنار شما هستیم.",
    image: "/images/section-two-image.jpg",
    accent: "amber",
  },
];

const AUTOPLAY_MS = 6000;

const accentClass: Record<Accent, string> = {
  cyan: "text-cyan-400 bg-cyan-600 hover:bg-cyan-500",
  emerald: "text-emerald-400 bg-emerald-600 hover:bg-emerald-500",
  amber: "text-amber-400 bg-amber-600 hover:bg-amber-500",
};

const accentHighlight: Record<Accent, string> = {
  cyan: "text-cyan-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
};

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = SLIDES[index];

  const goTo = useCallback((i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(
    () => goTo(index + 1),
    [index, goTo]
  );
  const prev = useCallback(
    () => goTo(index - 1),
    [index, goTo]
  );

  /* Preload next images for smooth transitions */
  useEffect(() => {
    SLIDES.forEach((s, i) => {
      if (i === 0) return;
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  /* Autoplay: pause when tab hidden or user hovers */
  useEffect(() => {
    if (isPaused) return;
    if (typeof document !== "undefined" && document.visibilityState !== "visible")
      return;

    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index, isPaused, next]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") setIsPaused(true);
      else setIsPaused(false);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") prev();
      else if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  return (
    <section
      className="relative h-[calc(100dvh-64px)] min-h-[520px] bg-slate-950 overflow-hidden group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.highlight}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover brightness-[0.78] transition-opacity duration-500"
          fetchPriority={index === 0 ? "high" : "auto"}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-6 lg:px-24 flex items-center">
        <div
          key={slide.id}
          className="max-w-3xl w-full rounded-2xl bg-black/40 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-6 sm:p-8 lg:p-10 min-h-[400px] animate-fadeIn"
        >
          <span
            className={`inline-flex mb-4 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase border border-white/20 ${accentClass[slide.accent]}`}
          >
            {slide.tag}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
            {slide.title}
            <span className={`block ${accentHighlight[slide.accent]}`}>
              {slide.highlight}
            </span>
          </h1>

          <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-bold text-white shadow-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${accentClass[slide.accent]}`}
            >
              مشاهده محصولات
              <FiArrowLeft />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg border border-white/30 bg-white/10 text-white/90 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              مشاوره تخصصی
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
        <div className="flex gap-1.5" role="tablist" aria-label="انتخاب اسلاید">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`اسلاید ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                i === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={prev}
            aria-label="اسلاید قبلی"
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <FiChevronRight />
          </button>
          <button
            onClick={next}
            aria-label="اسلاید بعدی"
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <FiChevronLeft />
          </button>
        </div>
      </div>
    </section>
  );
}
