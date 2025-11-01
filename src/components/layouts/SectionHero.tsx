"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

// === Animated Siemens-industrial hero section with autoplay and parallax ===
export default function SectionHero() {
  // Slides configuration
  const slides = useMemo(
    () => [
      {
        id: 1,
        title: "شرکت مهندسی زیمنس پلاس",
        subtitle: "همراه مطمئن شما در اتوماسیون و برق صنعتی",
        image: "/images/hero-industrial-solder.jpg",
        accent: "#00a9e0",
      },
      {
        id: 2,
        title: "فروش قطعات زیمنس",
        subtitle: "تضمین اصالت، بهترین قیمت و پشتیبانی فنی",
        image: "/images/section-one-image.jpg",
        accent: "#00cfb9",
      },
      {
        id: 3,
        title: "تعمیرات تخصصی زیمنس",
        subtitle: "تشخیص دقیق، تعمیر مطمئن، تحویل سریع",
        image: "/images/section-two-image.jpg",
        accent: "#ffd166",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);
  const AUTOPLAY_MS = 5200;

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + slides.length) % slides.length);
      else if (e.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    startTsRef.current = performance.now();

    // defer React state update
    requestAnimationFrame(() => setProgress(0));

    const tick = () => {
      if (isPaused) {
        startTsRef.current = performance.now() - progress * AUTOPLAY_MS;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = performance.now() - startTsRef.current;
      const p = Math.min(1, elapsed / AUTOPLAY_MS);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides.length, isPaused]);

  const current = slides[index];

  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const yAccentTop = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const yAccentBottom = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const contentVariants = {
    initial: { opacity: 0, y: 18, filter: "blur(4px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6 },
    },
    exit: {
      opacity: 0,
      y: -18,
      filter: "blur(4px)",
      transition: { duration: 0.4 },
    },
  } as const;

  const imageVariants = {
    initial: { opacity: 0, scale: 0.98, y: 14 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.65, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.45 } },
  } as const;

  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden bg-[#0b1730]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient BG */}
      <div className="absolute inset-0 -z-10 bg--to-tr from-[#0b1730] via-[#0d1e3f] to-[#0a234a]" />

      {/* Accent blobs */}
      <motion.div
        style={{ y: yAccentTop }}
        className="absolute -top-24 -left-24 w-[42vw] h-[42vw] max-w-[540px] max-h-[540px] rounded-full -z-10"
      >
        <div
          className="w-full h-full rounded-full blur-3xl"
          style={{ backgroundColor: `${current.accent}33` }}
        />
      </motion.div>
      <motion.div
        style={{ y: yAccentBottom }}
        className="absolute -bottom-28 -right-28 w-[36vw] h-[36vw] max-w-[460px] max-h-[460px] rounded-full -z-10"
      >
        <div
          className="w-full h-full rounded-full blur-3xl"
          style={{ backgroundColor: `${current.accent}1A` }}
        />
      </motion.div>

      {/* Circuit paths + glow sweep */}
      <motion.svg
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[.18]"
        viewBox="0 0 1200 600"
      >
        <g stroke="#8bcdf1" strokeWidth="1.2" fill="none" strokeLinecap="round">
          <motion.path
            d="M50 120 H240 V80 H420 V160 H520 V120 H680"
            strokeDasharray="6 8"
            initial={{ strokeDashoffset: 60 }}
            animate={{ strokeDashoffset: [60, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M200 300 H360 V260 H520 V340 H700 V300 H980"
            strokeDasharray="8 10"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: [100, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: 0.6,
            }}
          />
          <motion.path
            d="M80 460 H260 V420 H420 V500 H600 V460 H860 V420 H1100"
            strokeDasharray="5 9"
            initial={{ strokeDashoffset: 80 }}
            animate={{ strokeDashoffset: [80, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
              delay: 1.2,
            }}
          />
        </g>
      </motion.svg>

      <motion.div
        aria-hidden
        className="absolute -z-10 -inset-40"
        initial={{ opacity: 0, x: -180, y: -180 }}
        animate={{ opacity: [0, 0.22, 0], x: [-180, 180], y: [-180, 180] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        style={{
          background:
            "radial-gradient(120px 120px at center, rgba(0,169,224,0.24) 0%, rgba(0,169,224,0) 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Content */}
      <div
        className="max-w-7xl mx-auto px-[clamp(1.25rem,6vw,3rem)] py-[clamp(3rem,8vw,6rem)]
      grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
      >
        <div className="text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs uppercase px-2 py-1 rounded-md bg-white/10 border border-white/15">
              Siemens plus
            </span>
            <div className="relative h-[3px] flex-1 rounded bg-white/10 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-white/80"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current.id}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h1 className="text-[clamp(2rem,5vw,3.25rem)] leading-tight font-extrabold tracking-tight">
                {current.title}
              </h1>
              <p className="mt-4 text-[clamp(0.95rem,2.4vw,1.125rem)] text-white/85 leading-relaxed max-w-[46ch]">
                {current.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="px-6 py-2.5 rounded-xl text-black font-vazir-semibold shadow-[0_10px_28px_-10px_rgba(0,169,224,.7)] hover:brightness-110 transition"
                  style={{ backgroundColor: current.accent }}
                >
                  شروع مشاوره
                </a>
                <a
                  href="#products"
                  className="px-6 py-2.5 rounded-xl border border-white/25 text-white/95 hover:bg-white/10 transition"
                >
                  مشاهده محصولات
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-2 text-xs text-white/80">
                <li className="px-2 py-1 rounded-md bg-white/10 border border-white/10">
                  اورجینال
                </li>
                <li className="px-2 py-1 rounded-md bg-white/10 border border-white/10">
                  گارانتی معتبر
                </li>
                <li className="px-2 py-1 rounded-md bg-white/10 border border-white/10">
                  پشتیبانی فنی
                </li>
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Image side */}
        <div className="relative h-80 sm:h-[380px] md:h-[420px] select-none">
          <div className="absolute inset-0 rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-xl" />
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${current.id}`}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-3 rounded-3xl overflow-hidden"
            >
              <motion.div style={{ y: yImage }} className="absolute inset-0">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt="تصویر صنعتی"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>
              </motion.div>
              <div className="absolute inset-0 bg-linear-to-t from-[#0b1730]/60 via-transparent to-transparent" />
              <div
                className="absolute -inset-2 rounded-[inherit] border"
                style={{ borderColor: `${current.accent}55` }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Swipe capture for mobile */}
      <SwipeZone
        onSwipeLeft={() => setIndex((i) => (i + 1) % slides.length)}
        onSwipeRight={() =>
          setIndex((i) => (i - 1 + slides.length) % slides.length)
        }
      />
    </section>
  );
}

// ==== Touch swipe detector ====
function SwipeZone({
  onSwipeLeft,
  onSwipeRight,
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const startX = useRef<number | null>(null);
  const delta = useRef(0);

  const handleStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
    delta.current = 0;
  }, []);

  const handleMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (startX.current == null) return;
    delta.current = e.touches[0].clientX - startX.current;
  }, []);

  const handleEnd = useCallback(() => {
    if (Math.abs(delta.current) > 40) {
      if (delta.current < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
  }, [onSwipeLeft, onSwipeRight]);
  return (
    <div
      className="absolute inset-0 md:hidden"
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    />
  );
}
