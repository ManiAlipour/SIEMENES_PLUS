"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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

const AUTOPLAY = 6000;

const accentClass: Record<Accent, string> = {
  cyan: "text-cyan-400 bg-cyan-600 hover:bg-cyan-500",
  emerald: "text-emerald-400 bg-emerald-600 hover:bg-emerald-500",
  amber: "text-amber-400 bg-amber-600 hover:bg-amber-500",
};

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  /* Autoplay only when tab is visible */
  useEffect(() => {
    if (document.visibilityState !== "visible") return;

    const id = setInterval(next, AUTOPLAY);
    return () => clearInterval(id);
  }, [index]);

  return (
    <section className="relative h-[calc(100dvh-64px)] min-h-[520px] bg-slate-950 overflow-hidden">
      {/* === Background === */}
      <div className="absolute inset-0">
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.highlight}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover brightness-[0.78]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-transparent" />
      </div>

      {/* === Content === */}
      <div className="relative z-10 h-full container mx-auto px-6 lg:px-24 flex items-center">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="
            max-w-3xl w-full
            rounded-2xl
            bg-white/5
            border border-white/10
            backdrop-blur-lg
            shadow-[0_20px_60px_rgba(0,0,0,0.45)]
            p-6 sm:p-8 lg:p-10
            min-h-[400px]
          "
        >
          {/* Tag */}
          <span
            className={`
              inline-flex mb-4 px-3 py-1 rounded
              text-xs font-bold tracking-widest uppercase
              border border-white/20
              ${accentClass[slide.accent]}
            `}
          >
            {slide.tag}
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
            {slide.title}
            <span
              className={`block ${
                slide.accent === "cyan"
                  ? "text-cyan-400"
                  : slide.accent === "emerald"
                    ? "text-emerald-400"
                    : "text-amber-400"
              }`}
            >
              {slide.highlight}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
            {slide.description}
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className={`
                inline-flex items-center justify-center gap-2
                px-7 py-3.5 rounded-lg
                font-bold text-white
                shadow-xl transition
                ${accentClass[slide.accent]}
              `}
            >
              مشاهده محصولات
              <FiArrowLeft />
            </Link>

            <Link
              href="/contact-us"
              className="
                inline-flex items-center justify-center
                px-7 py-3.5 rounded-lg
                border border-white/30
                bg-white/10 text-white/90
                hover:bg-white/20 transition
              "
            >
              مشاوره تخصصی
            </Link>
          </div>
        </motion.div>
      </div>

      {/* === Controls === */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        <button
          onClick={prev}
          aria-label="اسلاید قبلی"
          className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition"
        >
          <FiChevronRight />
        </button>
        <button
          onClick={next}
          aria-label="اسلاید بعدی"
          className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition"
        >
          <FiChevronLeft />
        </button>
      </div>
    </section>
  );
}
