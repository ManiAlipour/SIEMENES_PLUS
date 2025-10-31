"use client";
import { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";

const keywords = ["اتوماسیون", "مهندسی", "خلاقیت", "کیفیت", "سرعت"];

// Rotating phrases for title and subtitle
const titlePhrases = [
  "آینده اتوماسیون، همین‌جاست",
  "قدرت مهندسی در خدمت سرعت",
  "هوشمندی صنعتی، نسخه‌ی امروز",
];
const subtitlePhrases = [
  "راهکارهای دقیق برای صنایع پیشرو",
  "کیفیت پایدار، عملکرد برتر",
  "از ایده تا اجرا، کنار شما",
];

const sideImages = [
  {
    src: "/images/section-one-image.jpg",
    alt: "industrial-1",
    accent: "#18a1e0",
  },
  {
    src: "/images/section-two-image.jpg",
    alt: "industrial-2",
    accent: "#00cfb9",
  },
  {
    src: "/images/hero-industrial-solder.jpg",
    alt: "industrial-3",
    accent: "#fd707e",
  },
  { src: "/images/section-two-bg.jpg", alt: "industrial-4", accent: "#ffd166" },
  { src: "/images/section-one-bg.jpg", alt: "industrial-5", accent: "#a78bfa" },
];

const shapes = [
  "rounded-[22%_78%_30%_70%/44%_56%_42%_58%]",
  "rounded-[65%_35%_58%_42%/50%_50%_50%_50%]",
  "rounded-[30%_70%_50%_50%/48%_52%_40%_60%]",
  "rounded-[50%]",
];

export default function SectionHero() {
  const [tick, setTick] = useState(0);
  const [kw, setKw] = useState(0);
  const [titleIdx, setTitleIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 5200);
    const k = setInterval(() => setKw((v) => (v + 1) % keywords.length), 2200);
    const tt = setInterval(
      () => setTitleIdx((v) => (v + 1) % titlePhrases.length),
      4800
    );
    const st = setInterval(
      () => setSubIdx((v) => (v + 1) % subtitlePhrases.length),
      4200
    );
    return () => {
      clearInterval(t);
      clearInterval(k);
      clearInterval(tt);
      clearInterval(st);
    };
  }, []);

  const leftIdx = useMemo(() => (tick * 3) % sideImages.length, [tick]);
  const rightIdx = useMemo(() => (tick * 5 + 1) % sideImages.length, [tick]);
  const leftShape = useMemo(() => shapes[(tick + 1) % shapes.length], [tick]);
  const rightShape = useMemo(() => shapes[(tick + 2) % shapes.length], [tick]);

  // Micro-parallax with scroll
  const { scrollYProgress } = useScroll();
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, 3]);

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, delayChildren: 0.15 },
    },
  } as const;
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  } as const;

  return (
    <section
      dir="rtl"
      className="relative w-full min-h-[calc(100svh-64px)] overflow-hidden bg-[#0e1622] flex items-center"
    >
      {/* Minimal background with grain and subtle dotted pattern */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(255,255,255,.07) 0 1px, transparent 1px), radial-gradient(circle at 60% 30%, rgba(255,255,255,.06) 0 1px, transparent 1px)",
          backgroundSize: "14px 14px, 18px 18px",
        }}
      />
      <div className="absolute inset-0 z-0 bg-linear-to-tr from-[#0a2237] via-[#0f1f33] to-[#0b2038]" />
      {/* Very subtle noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[.06] mix-blend-overlay"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="120" height="120" filter="url(%23n)" opacity="0.35"/></svg>\')',
          backgroundSize: "120px 120px",
        }}
      />

      {/* Center content with staggered animation */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-[clamp(1.25rem,6vw,4rem)] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        <motion.div
          className="flex flex-col gap-5 md:gap-6 text-white"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Animated rotating title */}
          <div className="min-h-[2.6em]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={titleIdx}
                className="text-[2rem] sm:text-[2.5rem] md:text-6xl font-extrabold leading-[1.15] tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-cyan-200 to-white"
                initial={{
                  opacity: 0,
                  y: 30,
                  rotateX: -25,
                  filter: "blur(6px)",
                }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -28, rotateX: 20, filter: "blur(6px)" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {titlePhrases[titleIdx]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Animated rotating subtitle */}
          <div className="min-h-[2em] text-lg sm:text-xl md:text-2xl text-white/85">
            <AnimatePresence mode="wait">
              <motion.div
                key={subIdx}
                initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
                transition={{ duration: 0.55 }}
              >
                {subtitlePhrases[subIdx]} {" | "}
                <span>راهکارهای </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={kw}
                    initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                    transition={{ duration: 0.45 }}
                    className="mx-2 font-black text-cyan-300"
                  >
                    {keywords[kw]}
                  </motion.span>
                </AnimatePresence>
                <span>برای صنایع حرفه‌ای.</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            className="flex items-center gap-3 sm:gap-4 pt-1.5"
            variants={itemVariants}
          >
            <a
              href="#contact"
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-cyan-500 text-white font-bold shadow-[0_10px_40px_-10px_rgba(34,211,238,.6)] hover:brightness-110 hover:scale-[1.03] transition"
              aria-label="مشاوره رایگان"
            >
              مشاوره رایگان
            </a>
            <a
              href="#products"
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl border border-white/25 text-white/95 hover:bg-white/10 transition"
              aria-label="مشاهده محصولات"
            >
              مشاهده محصولات
            </a>
          </motion.div>
        </motion.div>

        {/* Placeholder central panel for desktop balance */}
        <div className="hidden md:block relative h-[360px] lg:h-[420px]">
          <div className="absolute inset-0 rounded-[24px] lg:rounded-[28px] bg-white/3 border border-white/10 backdrop-blur-xl" />
          <div className="absolute -inset-6 blur-3xl bg-cyan-400/20 rounded-[36px] lg:rounded-[40px]" />
        </div>
      </div>

      {/* Floating image (left) with micro-parallax */}
      <div className="pointer-events-none absolute left-[-10vw] sm:left-[-6vw] md:left-[-3vw] top-[6vh] md:top-[10vh] z-10">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`L-${tick}`}
            initial={{ x: -120, y: 40, rotate: -6, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            exit={{ x: -100, y: -40, rotate: -8, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className={`relative w-[58vw] sm:w-[46vw] md:w-[44vw] max-w-[300px] sm:max-w-[340px] md:max-w-[360px] h-[68vw] sm:h-[56vw] md:h-[54vw] max-h-[420px] sm:max-h-[440px] md:max-h-[460px] overflow-hidden border-2 border-white/25 shadow-2xl ${leftShape}`}
            style={{ y: yLeft }}
          >
            <Image
              src={sideImages[leftIdx].src}
              alt={sideImages[leftIdx].alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
            <div
              className="absolute -inset-2 rounded-[inherit] border"
              style={{ borderColor: `${sideImages[leftIdx].accent}88` }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating image (right) with micro-parallax */}
      <div className="pointer-events-none absolute right-[-10vw] sm:right-[-6vw] md:right-[-3vw] bottom-[6vh] md:bottom-[10vh] z-10">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`R-${tick}`}
            initial={{ x: 120, y: 40, rotate: 6, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            exit={{ x: 100, y: -40, rotate: 8, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className={`relative w-[52vw] sm:w-[44vw] md:w-[42vw] max-w-[280px] sm:max-w-[320px] md:max-w-[340px] h-[52vw] sm:h-[44vw] md:h-[42vw] max-h-[340px] sm:max-h-[360px] md:max-h-[380px] overflow-hidden border-2 border-white/25 shadow-2xl ${rightShape}`}
            style={{ y: yRight }}
          >
            <Image
              src={sideImages[rightIdx].src}
              alt={sideImages[rightIdx].alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/35 to-transparent" />
            <div
              className="absolute -inset-2 rounded-[inherit] border"
              style={{ borderColor: `${sideImages[rightIdx].accent}88` }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Soft vignette for focus */}
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{ boxShadow: "inset 0 0 140px rgba(0,0,0,.55)" }}
      />
    </section>
  );
}
