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
  align: "left" | "right";
};

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: "Industrial Automation",
    title: "فروش و تامین",
    highlight: "تجهیزات زیمنس",
    description:
      "فروش تجهیزات اصلی SIEMENS به همراه ضمانت اصالت و راه اندازی همراه با پشتیبانی تخصصی",
    image: "/images/hero2.webp",
    accent: "cyan",
    align: "right",
  },
  {
    id: 2,
    tag: "Drive Technology",
    title: "تعمیر و نگه داری",
    highlight: "تجهیزات زیمنس",
    description: `تعمیرات تخصصی سیستم های siemens:
کنترل، درایو، موتور، انکودر، خط کش و ...`,
    image: "/images/hero1.webp",
    accent: "emerald",
    align: "left",
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

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    SLIDES.forEach((s, i) => {
      if (i === 0) return;
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    if (
      typeof document !== "undefined" &&
      document.visibilityState !== "visible"
    )
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
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

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
      className="relative h-[calc(100dvh)] min-h-[520px] bg-slate-950 overflow-hidden group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Layer */}
      <div className="absolute inset-0">
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.highlight}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div
        className={`relative z-10 h-full container mx-auto px-6 lg:px-24 flex items-center
        justify-center
        ${slide.align === "right" ? "lg:justify-end" : "lg:justify-start"}`}
      >
        <div
          key={slide.id}
          className="max-w-2xl w-full rounded-2xl
          p-6 sm:p-10 min-h-[380px] animate-fadeIn text-right"
          dir="rtl"
        >
          <span
            className={`inline-flex mb-6 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase border border-white/10 ${accentClass[slide.accent]}`}
          >
            {slide.tag}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.2]">
            {slide.title}
            <span className={`block mt-2 ${accentHighlight[slide.accent]}`}>
              {slide.highlight}
            </span>
          </h1>

          <p className="mt-6 text-slate-200 text-base sm:text-lg leading-relaxed">
            {slide.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-start">
            <Link
              href="/shop"
              className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${accentClass[slide.accent]}`}
            >
              مشاهده محصولات
              <FiArrowLeft className="text-xl" />
            </Link>

            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/30 bg-white/5 text-white font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              مشاوره تخصصی
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 z-20 flex items-center gap-6">
        <div className="flex gap-2" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index
                  ? "w-10 bg-white"
                  : "w-3 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="hidden sm:flex gap-3">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full bg-black/20 border border-white/10 text-white hover:bg-white hover:text-black transition-all flex justify-center items-center backdrop-blur-md"
          >
            <FiChevronRight size={20} />
          </button>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full bg-black/20 border border-white/10 text-white hover:bg-white hover:text-black transition-all flex justify-center items-center backdrop-blur-md"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
