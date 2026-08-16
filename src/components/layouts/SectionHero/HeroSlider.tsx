"use client";

import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import HeroSlide from "./HeroSlide";
import type { Slide } from "./hero.data";

const AUTOPLAY_MS = 7000;

type Props = {
  slides: Slide[];
};

export default function HeroSliderClient({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

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
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion || slides.length <= 1) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPaused, next, reduceMotion, slides.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="relative w-full min-h-[70svh] aspect-[4/5] sm:aspect-[16/10] sm:min-h-0 lg:aspect-auto lg:h-[100dvh] lg:min-h-[640px]">
        {slides.map((slide, i) => {
          const isActive = i === index;
          const isNear =
            Math.abs(i - index) <= 1 ||
            (index === 0 && i === slides.length - 1) ||
            (index === slides.length - 1 && i === 0);

          if (!isActive && !isNear) return null;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity ${
                reduceMotion ? "duration-0" : "duration-700"
              } ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <HeroSlide
                slide={slide}
                isPrimary={i === 0}
                isActive={isActive}
              />
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-5 sm:bottom-8 inset-x-0 z-20 flex items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2" role="tablist" aria-label="اسلایدها">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              onClick={() => goTo(i)}
              aria-label={`اسلاید ${i + 1}`}
              aria-selected={i === index}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index
                  ? "w-10 bg-white"
                  : "w-3 bg-white/35 hover:bg-white/55"
              }`}
            />
          ))}
        </div>

        <div className="hidden sm:flex gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="اسلاید قبلی"
            className="grid h-11 w-11 place-items-center border border-white/25 text-white transition hover:bg-white hover:text-slate-900"
          >
            <FiChevronRight size={22} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="اسلاید بعدی"
            className="grid h-11 w-11 place-items-center border border-white/25 text-white transition hover:bg-white hover:text-slate-900"
          >
            <FiChevronLeft size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
