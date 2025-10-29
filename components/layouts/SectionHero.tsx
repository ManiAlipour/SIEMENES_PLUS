"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "تجهیزات اتوماسیون صنعتی زیمنس",
    description:
      "انواع پی‌ال‌سی، اچ‌ام‌آی و قطعات صنعتی با ضمانت اصالت کالا و ارسال سریع به سراسر کشور.",
    image: "/images/section-one-image.jpg",
    boxImage: "/images/section-one-bg.jpg",
  },
  {
    id: 2,
    title: "خدمات تعمیر و پشتیبانی تخصصی",
    description:
      "تیم فنی ما آماده ارائه خدمات تعمیر، نگهداری و مشاوره در زمینه تجهیزات اتوماسیون است.",
    image: "/images/section-two-bg.jpg",
    boxImage: "/images/section-two-image.jpg",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Disable autoplay for mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full h-[90dvh] md:h-[85vh] overflow-hidden flex items-center justify-center text-right bg-[#f7f7f7]"
      dir="rtl"
    >
      {/* --- Background image --- */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              sizes="100vw"
              priority
              quality={95}
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#0a1924e0] via-[#1e3a52cc] to-[#f7f7f7b3]" />
      </div>

      {/* --- Main content --- */}
      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center md:justify-end px-6 md:px-[clamp(2rem,8vw,5rem)] gap-8 md:gap-10 pt-[clamp(4rem,12vh,7rem)] md:pt-0">
        {/* Text Block */}
        <motion.div
          key={slides[current].title}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 order-2 md:order-1 text-white space-y-6 font-vazir"
        >
          <h1 className="text-[1.8rem] md:text-5xl font-extrabold leading-snug tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            {slides[current].title}
          </h1>
          <p className="text-base md:text-lg text-gray-100/90 leading-relaxed max-w-xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
            {slides[current].description}
          </p>

          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-7 py-3 rounded-xl font-medium shadow-md transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5">
              مشاهده جزئیات
            </button>
            <button className="border border-white/70 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/15">
              تماس با ما
            </button>
          </div>
        </motion.div>

        {/* Box Image */}
        <motion.div
          key={slides[current].boxImage}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative order-1 md:order-2 w-full flex justify-center"
        >
          <div className="relative w-10/12 md:w-4/5 h-[clamp(280px,40vw,420px)] rounded-2xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <Image
              src={slides[current].boxImage}
              alt={slides[current].title}
              fill
              sizes="50vw"
              className="object-cover"
              priority
              quality={95}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00000033] via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* --- Slider Controls --- */}
      <div
        className="
          absolute z-30 flex justify-between w-full px-4
          md:w-auto md:flex-row-reverse md:gap-3
          md:right-[clamp(3%,5vw,4rem)] md:bottom-[clamp(3rem,6vh,4rem)]
          top-auto md:top-auto
        "
      >
        <button
          onClick={nextSlide}
          className="bg-white/90 hover:bg-white text-gray-700 p-2.5 md:p-3 rounded-full shadow-md backdrop-blur-sm hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <FiChevronLeft size={18} className="md:size-[22px]" />
        </button>
        <button
          onClick={prevSlide}
          className="bg-white/90 hover:bg-white text-gray-700 p-2.5 md:p-3 rounded-full shadow-md backdrop-blur-sm hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <FiChevronRight size={18} className="md:size-[22px]" />
        </button>
      </div>

      {/* --- Navigation Dots --- */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[clamp(2rem,5vh,3rem)] flex gap-2 z-[25]">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer border transition-all duration-300 ${
              current === i
                ? "bg-primary border-primary/70 scale-110"
                : "bg-white/70 border-gray-300 hover:bg-primary/40 hover:border-primary/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
