"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Added Variants type
import { FiArrowLeft, FiChevronRight, FiChevronLeft } from "react-icons/fi";

// === DATA ===
const slides = [
  {
    id: 1,
    tag: "Industrial Automation",
    title: "هوشمندی در صنعت",
    description:
      "ارتقای خطوط تولید با نسل جدید پی‌ال‌سی‌های S7-1500 زیمنس. پایداری، سرعت و دقت همزمان.",
    image: "/images/hero-industrial-solder.jpg",
    color: "text-cyan-400",
    btnColor: "bg-cyan-600 hover:bg-cyan-500",
    borderColor: "border-cyan-500/30",
  },
  {
    id: 2,
    tag: "Drive Technology",
    title: "قدرت محرکه بی‌پایان",
    description:
      "درایوهای سینامیکس با بالاترین راندمان انرژی. کنترل دقیق موتورهای صنعتی.",
    image: "/images/section-one-image.jpg",
    color: "text-emerald-400",
    btnColor: "bg-emerald-600 hover:bg-emerald-500",
    borderColor: "border-emerald-500/30",
  },
  {
    id: 3,
    tag: "Technical Support",
    title: "تعمیرات تخصصی",
    description:
      "تیم مهندسی ما در تمام مراحل نصب و راه‌اندازی همراه شماست تا توقف تولید به صفر برسد.",
    image: "/images/section-two-image.jpg",
    color: "text-amber-400",
    btnColor: "bg-amber-600 hover:bg-amber-500",
    borderColor: "border-amber-500/30",
  },
];

const AUTOPLAY_TIME = 6000;

export default function HeroSectionMobileOptimized() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // --- Logic ---
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, AUTOPLAY_TIME);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const currentSlide = slides[currentIndex];

  // --- Animation Variants (FIXED TYPES) ---

  // Explicitly typing this as 'Variants' fixes the TS error
  const slideVariants: Variants = {
    initial: { scale: 1.1, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const textVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        // Using a Bezier array is safer for TS than string literals like "easeOut"
        // [0.25, 0.1, 0.25, 1] is equivalent to standard 'ease'
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section
      className="relative w-full l h-[calc(100dvh-80px)] lg:h-[85vh] min-h-[500px] bg-slate-950 
      overflow-hidden font-vazir group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* === 1. Background Image & Overlays === */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide.id}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            className="object-cover object-center"
            priority
          />

          {/* Mobile Overlay: Strong gradient from bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/50 lg:to-transparent opacity-90 lg:opacity-100" />
        </motion.div>
      </AnimatePresence>

      {/* === 2. Text Content === */}
      <div className="absolute inset-0 container mx-auto px-5 sm:px-6 flex flex-col justify-end lg:justify-center pb-28 lg:pb-0 z-20">
        <div className="max-w-3xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentIndex}`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-start"
            >
              {/* Tag */}
              <motion.div variants={textVariants} className="mb-3 lg:mb-4">
                <span
                  className={`inline-block px-3 py-1 bg-black/40 backdrop-blur-md border ${currentSlide.borderColor} rounded text-xs lg:text-sm font-bold tracking-wider uppercase ${currentSlide.color}`}
                >
                  {currentSlide.tag}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={textVariants}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 drop-shadow-lg"
              >
                {currentSlide.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={textVariants}
                transition={{ delay: 0.2 }}
                className="text-slate-300 text-sm sm:text-base lg:text-xl leading-relaxed mb-8 max-w-xl drop-shadow-md"
              >
                {currentSlide.description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={textVariants}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
              >
                <button
                  className={`w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-white font-bold transition-all shadow-lg flex justify-center items-center gap-2 ${currentSlide.btnColor}`}
                >
                  محصولات مرتبط
                  <FiArrowLeft />
                </button>
                <button className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-white font-medium border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all">
                  تماس با ما
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* === 3. Bottom Controls (Responsive) === */}
      <div className="absolute bottom-0 left-0 w-full z-30 border-t border-white/10 bg-slate-950/50 backdrop-blur-md">
        <div className="container mx-auto px-5 sm:px-6 h-16 lg:h-20 flex items-center justify-between">
          {/* Left: Progress */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4 w-full max-w-[120px] lg:max-w-md">
            <div className="text-xs lg:text-base text-slate-400 font-mono hidden lg:block">
              <span className="text-white font-bold">0{currentIndex + 1}</span>{" "}
              / 0{slides.length}
            </div>
            {/* Progress Line */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTOPLAY_TIME / 1000, ease: "linear" }}
                className={`h-full ${currentSlide.btnColor}`}
              />
            </div>
          </div>

          {/* Right: Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-white/10 text-white active:bg-white active:text-black lg:hover:bg-white lg:hover:text-black transition-all"
            >
              <FiChevronRight size={20} className="lg:hidden" />
              <FiChevronRight size={24} className="hidden lg:block" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-white/10 text-white active:bg-white active:text-black lg:hover:bg-white lg:hover:text-black transition-all"
            >
              <FiChevronLeft size={20} className="lg:hidden" />
              <FiChevronLeft size={24} className="hidden lg:block" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
