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

  // تغییر خودکار اسلاید در دسکتاپ فقط
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      dir="rtl"
      className="
        relative w-full 
        h-[calc(100svh-64px)] md:h-[85vh] 
        overflow-hidden flex items-center justify-center 
        text-right bg-background
      "
    >
      {/* --- تصویر پس‌زمینه --- */}
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

        {/* گرادینت تاریک روی تصویر پس‌زمینه */}
        <div className="absolute inset-0 bg-gradient-to-l from-[rgba(10,25,36,0.85)] via-[rgba(30,58,82,0.75)] to-background" />
      </div>

      {/* --- محتوای اصلی --- */}
      <div
        className="
          relative z-10 max-w-7xl w-full mx-auto
          flex flex-col-reverse md:flex-row items-center
          md:justify-end px-6 md:px-[clamp(2rem,8vw,5rem)]
          gap-8 md:gap-10 pt-[clamp(2rem,10vh,5rem)] md:pt-0
        "
      >
        {/* --- بلوک متن --- */}
        <motion.div
          key={slides[current].title}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="
            flex-1 text-white space-y-6 font-vazir
            md:order-1
          "
        >
          <h1
            className="
              text-[1.8rem] md:text-5xl font-extrabold leading-snug tracking-tight
              drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]
            "
          >
            {slides[current].title}
          </h1>

          <p
            className="
              text-base md:text-lg text-white/90 leading-relaxed max-w-xl
              drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]
            "
          >
            {slides[current].description}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              className="
                bg-primary text-white px-7 py-3 rounded-xl font-medium shadow-md 
                transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5
              "
            >
              مشاهده جزئیات
            </button>
            <button
              className="
                border border-white/70 text-white px-6 py-3 rounded-xl font-medium 
                transition-all duration-300 hover:bg-white/20 hover:brightness-110
              "
            >
              تماس با ما
            </button>
          </div>
        </motion.div>

        {/* --- تصویر باکس کنار متن --- */}
        <motion.div
          key={slides[current].boxImage}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative w-full flex justify-center md:order-2"
        >
          <div
            className="
              relative w-[90%] md:w-4/5 h-[clamp(220px,45vw,420px)]
              rounded-2xl overflow-hidden 
              shadow-[0_10px_40px_-10px_rgba(0,0,0,0.45)]
            "
          >
            <Image
              src={slides[current].boxImage}
              alt={slides[current].title}
              fill
              sizes="50vw"
              className="object-cover"
              priority
              quality={95}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* --- دکمه‌های کنترل اسلایدر --- */}
      <div
        className="
          absolute z-30 flex justify-between w-full px-4
          md:w-auto md:flex-row-reverse md:gap-3
          md:right-[clamp(3%,5vw,4rem)] 
          md:bottom-[clamp(3rem,6vh,4rem)]
        "
      >
        <button
          onClick={nextSlide}
          className="
            bg-card/90 hover:bg-card text-foreground 
            p-2.5 md:p-3 rounded-full shadow-md backdrop-blur-sm 
            hover:brightness-110 active:scale-95 transition-all duration-200
          "
        >
          <FiChevronLeft size={18} className="md:size-[22px]" />
        </button>
        <button
          onClick={prevSlide}
          className="
            bg-card/90 hover:bg-card text-foreground 
            p-2.5 md:p-3 rounded-full shadow-md backdrop-blur-sm
            hover:brightness-110 active:scale-95 transition-all duration-200
          "
        >
          <FiChevronRight size={18} className="md:size-[22px]" />
        </button>
      </div>

      {/* --- نقاط ناوبری --- */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[clamp(2rem,5vh,3rem)] flex gap-2 z-25">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer border transition-all duration-300 ${
              current === i
                ? "bg-primary border-primary/70 scale-110"
                : "bg-card/70 border-borders hover:bg-highlight/40 hover:border-highlight/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
