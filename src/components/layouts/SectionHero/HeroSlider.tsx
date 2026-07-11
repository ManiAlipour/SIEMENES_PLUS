"use client";

import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import HeroSlide from "./HeroSlide";
import type { Slide } from "./hero.data";

const AUTOPLAY_MS = 6000;

type Props = {
  slides: Slide[];
};

export default function HeroSliderClient({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => {
      setIndex((i + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPaused, next, slides.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full aspect-[16/10] sm:aspect-video lg:h-[100dvh] lg:min-h-[650px] transition-all duration-500">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={i !== index}
          >
            <HeroSlide
              slide={slide}
              isPrimary={i === 0}
              isActive={i === index}
            />
          </div>
        ))}
      </div>

      {/* Navigation Bars */}
      <div className="absolute bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 z-20 flex items-center gap-2 lg:gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`رفتن به اسلاید ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-1 lg:h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-8 lg:w-12 bg-white" : "w-3 lg:w-4 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Desktop Arrows */}
      <div className="hidden lg:flex absolute bottom-10 right-12 gap-4 z-20">
        <button
          type="button"
          onClick={prev}
          aria-label="اسلاید قبلی"
          className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <FiChevronRight size={24} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="اسلاید بعدی"
          className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
}
