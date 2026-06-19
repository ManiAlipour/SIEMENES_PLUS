"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

type Slide = {
  id: number;
  title: string;
  highlight: string;
  description: string;
  image: string;
  align: "left" | "right";
};

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "فروش و تامین تجهیزات زیمنس",
    highlight: "نمایندگی رسمی زیمنس در ایران",
    description:
      "تامین و فروش تجهیزات اصلی فشار ضعیف و اتوماسیون صنعتی با ضمانت اصالت کالا.",
    image: "/images/hero2.webp",
    align: "right",
  },
  {
    id: 2,
    title: "تعمیرات تخصصی",
    highlight: "پشتیبانی فنی و مهندسی",
    description:
      "ارائه خدمات نصب، راه‌اندازی و تعمیرات تخصصی درایوها و سیستم‌های کنترلی زیمنس.",
    image: "/images/hero1.webp",
    align: "left",
  },
];

const AUTOPLAY_MS = 6000;

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
    SLIDES.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index, isPaused, next]);

  return (
    <section
      className="relative bg-black overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      dir="rtl"
    >
      <div className="relative w-full aspect-[16/10] sm:aspect-video lg:h-[100dvh] lg:min-h-[650px] transition-all duration-500">
        <div className="absolute inset-0">
          <Image
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 md:bg-black/20" />
        </div>

        <div
          className={`relative z-10 h-full container mx-auto px-6 flex items-center 
  justify-center 
  ${slide.align === "left" ? "lg:justify-start" : "lg:justify-end"}`}
        >
          <div
            className={`max-w-3xl w-full flex flex-col items-center animate-fadeIn
            ${slide.align === "left" ? "lg:items-start lg:text-right" : "lg:items-end lg:text-right"}`}
          >
            <h1 className="text-white font-black text-2xl sm:text-4xl lg:text-7xl leading-tight">
              {slide.title}
            </h1>

            <p className="mt-1 lg:mt-4 text-white/90 font-medium text-sm sm:text-lg lg:text-3xl">
              {slide.highlight}
            </p>

            <p
              className={`mt-6 text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed hidden lg:block
      ${slide.align === "left" ? "text-right" : "text-right"}`}
            >
              {slide.description}
            </p>

            <div className="mt-6 lg:mt-10">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-2 lg:px-10 lg:py-3.5 border-2 border-white text-white font-bold text-xs sm:text-sm lg:text-lg hover:bg-white hover:text-black transition-all duration-300"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bars (Bottom) */}
      <div className="absolute bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 z-20 flex items-center gap-2 lg:gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1 lg:h-1.5 transition-all duration-500 rounded-full ${
              i === index ? "w-8 lg:w-12 bg-white" : "w-3 lg:w-4 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Desktop Arrows */}
      <div className="hidden lg:flex absolute bottom-10 right-12 gap-4 z-20">
        <button
          onClick={prev}
          className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <FiChevronRight size={24} />
        </button>
        <button
          onClick={next}
          className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>
    </section>
  );
}
