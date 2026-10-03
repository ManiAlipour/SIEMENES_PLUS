"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
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

  const tablistId = useId();

  const safeSlides = useMemo(() => slides ?? [], [slides]);
  const count = safeSlides.length;

  const goTo = useCallback(
    (i: number) => {
      if (count <= 0) return;
      setIndex((i + count) % count);
    },
    [count],
  );

  const next = useCallback(() => {
    if (count <= 1) return;
    setIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count <= 1) return;
    setIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion || count <= 1) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPaused, next, reduceMotion, count]);

  if (count === 0) return null;

  return (
    <section
      className="relative w-full"
      aria-label="اسلایدر هیرو"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setIsPaused(false);
      }}
    >
      {/* Viewport */}
      <div className="relative w-full overflow-hidden rounded-none">
        <div className="relative w-full min-h-[280px] aspect-[4/3] sm:min-h-0 sm:aspect-[16/9]
         lg:aspect-auto lg:h-[80dvh] lg:min-h-[640px]">
          {safeSlides.map((slide, i) => {
            const isActive = i === index;

            const isNear =
              Math.abs(i - index) <= 1 ||
              (index === 0 && i === count - 1) ||
              (index === count - 1 && i === 0);

            if (!isActive && !isNear) return null;

            return (
              <div
                key={slide.id}
                className={[
                  "absolute inset-0",
                  "transition-opacity",
                  reduceMotion ? "duration-0" : "duration-700",
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none",
                ].join(" ")}
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

        {/* Controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-7 z-20 flex items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Dots */}
          <div
            className="pointer-events-auto flex items-center gap-2"
            role="tablist"
            aria-label="اسلایدها"
            id={tablistId}
          >
            {safeSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                onClick={() => goTo(i)}
                aria-controls={`slide-${tablistId}-${i}`}
                aria-label={`اسلاید ${i + 1}`}
                aria-selected={i === index}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-10 bg-white"
                    : "w-3 bg-white/40 hover:bg-white/60",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="pointer-events-auto hidden sm:flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="اسلاید قبلی"
              className="grid h-11 w-11 place-items-center border border-white/30 text-white transition hover:bg-white hover:text-slate-900"
            >
              <FiChevronRight size={22} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="اسلاید بعدی"
              className="grid h-11 w-11 place-items-center border border-white/30 text-white transition hover:bg-white hover:text-slate-900"
            >
              <FiChevronLeft size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
