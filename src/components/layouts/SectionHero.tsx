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

// For better laptop UX/UI, increase paddings, widen text area, add image card shadow, soften overlays, center content vertically with more space. Add step dots as indicators.
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
    initial: { scale: 1.05, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.9 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const textVariants: Variants = {
    hidden: { y: 32, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <section
      role="region"
      aria-label="Industrial solutions hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[calc(100dvh-64px)] lg:h-[87vh] min-h-[540px] bg-slate-950 overflow-hidden"
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
          <div className="w-full h-full relative">
            <Image
              src={slide.image}
              alt={slide.highlight}
              fill
              priority
              className="object-cover"
              style={{ filter: "brightness(0.76) blur(0.5px)" }}
            />
            {/* Soften Overlay with stronger dark on left, fade right for text clarity on laptop */}
            <div
              className="
              absolute inset-0
              bg-gradient-to-tr
              from-slate-950/90
              via-slate-900/80
              to-slate-900/10
              lg:bg-gradient-to-br
              lg:from-black/80
              lg:via-black/50
              lg:to-transparent
              "
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* === Content === */}
      <div
        className="
        relative z-10 
        container mx-auto 
        px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32
        h-full flex items-center justify-center
      "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="
              w-full 
              max-w-2xl lg:max-w-3xl
              bg-white/5 backdrop-blur-xl border border-white/10
              shadow-2xl rounded-2xl
              p-6 px-4 sm:p-8 md:p-10 md:px-8 lg:py-10 lg:px-10
              mx-auto
              flex flex-col gap-2
              "
            style={{
              boxShadow:
                "0 8px 40px 0 rgba(18,32,86,0.14), 0 1.5px 7px 0 rgba(0,0,0,0.07)",
              minHeight: "410px",
              backdropFilter: "blur(7px)",
            }}
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

            {/* Title big, max: 2 lines */}
            <motion.h1
              variants={textVariants}
              transition={{ delay: 0.07 }}
              className="
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                font-black tracking-tight text-white leading-tight
                "
              style={{
                lineClamp: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
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
              transition={{ delay: 0.15 }}
              className="mt-2 max-w-2xl text-slate-200 text-[1rem]
               sm:text-base md:text-lg lg:text-xl"
              style={{
                fontWeight: 400,
                letterSpacing: "0.01rem",
                lineHeight: 1.7,
              }}
            >
              {slide.description}
            </motion.p>

            {/* CTA: bigger, more contrast on laptop */}
            <motion.div
              variants={textVariants}
              transition={{ delay: 0.22 }}
              className="mt-8 flex flex-col lg:flex-row gap-2 md:gap-4"
            >
              <button
                className={`inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-base md:text-lg text-white shadow-2xl transition
                focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  accentMap[slide.accent]
                }`}
                style={{
                  minWidth: "210px",
                }}
              >
                مشاهده محصولات صنعتی
                <FiArrowLeft />
              </button>

              <button className="inline-flex justify-center items-center px-7 py-3.5 rounded-lg border border-white/30 bg-white/10 text-white/90 font-bold text-base md:text-lg backdrop-blur-lg hover:bg-white/20 hover:text-blue-900 hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-white/70">
                مشاوره تخصصی
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* === Step Dots for Visual Feedback on Laptop === */}
      <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`رفتن به اسلاید ${i + 1}`}
              className={`w-3 h-3 my-6 rounded-full border-2 transition
                ${
                  i === index
                    ? "bg-white border-white/80 shadow-md scale-110"
                    : "bg-white/30 border-white/60 hover:bg-white/60"
                }
                `}
              style={{
                outline: "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* === Controls: larger, floating a bit higher on laptop === */}
      <div
        className="absolute left-0 right-0 z-30 flex justify-center lg:justify-end pointer-events-none"
        style={{ bottom: "46px" }}
      >
        <div className="container w-full flex justify-center lg:justify-end">
          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={prev}
              aria-label="اسلاید قبلی"
              className="w-12 h-12 md:w-14 md:h-14 flex justify-center items-center
               rounded-full border border-white/10 text-white hover:bg-white
                hover:text-black transition shadow-xl bg-white/10 backdrop-blur"
              style={{ fontSize: "1.5rem" }}
            >
              <FiChevronRight />
            </button>
            <button
              onClick={next}
              aria-label="اسلاید بعدی"
              className="w-12 h-12 md:w-14 md:h-14 flex justify-center items-center 
              rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition shadow-xl bg-white/10 backdrop-blur"
              style={{ fontSize: "1.5rem" }}
            >
              <FiChevronLeft />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom info, smaller on laptop, fades to bottom */}
      <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <div className="bg-black/40 rounded-full px-5 py-1 text-xs text-slate-300 font-mono shadow-lg backdrop-blur pointer-events-auto">
          <span className="text-white font-bold">۰{index + 1}</span> / ۰
          {SLIDES.length}
        </div>
      </div>
    </section>
  );
}
