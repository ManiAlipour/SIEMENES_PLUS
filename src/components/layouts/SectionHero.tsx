"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useToggle } from "iso-hooks";

type Slide = {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  accent: "cyan" | "emerald" | "amber";
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

const AUTOPLAY_DELAY = 6000;

const accentMap = {
  cyan: "text-cyan-400 bg-cyan-600 hover:bg-cyan-500 border-cyan-500/30",
  emerald:
    "text-emerald-400 bg-emerald-600 hover:bg-emerald-500 border-emerald-500/30",
  amber: "text-amber-400 bg-amber-600 hover:bg-amber-500 border-amber-500/30",
};

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useToggle(false);

  const slide = SLIDES[index];

  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, AUTOPLAY_DELAY);
    return () => clearTimeout(t);
  }, [index, paused]);

  const slideVariants: Variants = {
    initial: { scale: 1.08, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const textVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <section
      role="region"
      aria-label="Industrial solutions hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[calc(100dvh-64px)] lg:h-[85vh] min-h-[520px] bg-slate-950 overflow-hidden"
    >
      {/* === Background === */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.id}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.highlight}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/85 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/50 lg:to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* === Content === */}
      <div className="relative z-10 container mx-auto px-5 h-full flex items-end lg:items-center pb-24 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-w-3xl"
          >
            {/* Tag */}
            <motion.div variants={textVariants} className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold tracking-widest uppercase border backdrop-blur
                ${accentMap[slide.accent]}`}
              >
                {slide.tag}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={textVariants}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-snug"
            >
              {slide.title}{" "}
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
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={textVariants}
              transition={{ delay: 0.2 }}
              className="mt-5 max-w-xl text-slate-300 text-sm sm:text-base lg:text-lg"
            >
              {slide.description}
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={textVariants}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <button
                className={`inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-white shadow-lg transition
                ${accentMap[slide.accent]}`}
              >
                مشاهده محصولات صنعتی
                <FiArrowLeft />
              </button>

              <button className="inline-flex justify-center items-center px-7 py-3.5 rounded-lg border border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10 transition">
                مشاوره تخصصی
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* === Controls === */}
      <div className="absolute bottom-0 inset-x-0 z-20 h-14 bg-slate-950/60 backdrop-blur border-t border-white/10">
        <div className="container h-full mx-auto px-5 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            <span className="text-white font-bold">0{index + 1}</span> — 0
            {SLIDES.length}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Slide previous"
              className="w-10 h-10 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition"
            >
              <FiChevronRight />
            </button>
            <button
              onClick={next}
              aria-label="Slide next"
              className="w-10 h-10 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition"
            >
              <FiChevronLeft />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
