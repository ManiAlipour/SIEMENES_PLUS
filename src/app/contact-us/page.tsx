"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  return (
    <main
      className="min-h-screen font-vazir text-[#1e1e1e] 
                     bg-linear-to-b from-[#f9fdff] via-[#e6faff] to-[#d7f7ff] overflow-hidden"
    >
      {/* ===== HERO ===== */}
      <section className="relative text-center pt-24 md:pt-28 pb-16 md:pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#004C97] to-[#00AFC1] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,172,201,0.25)]"
        >
          تماس با <span className="text-[#004C97]">زیمنس‌پلاس</span>
        </motion.h1>

        <div className="animate-pulse-line" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mt-5 text-gray-600 text-lg leading-relaxed"
        >
          تیم فنی و مهندسی زیمنس‌پلاس همیشه آمادهٔ پاسخ‌گویی به پرسش‌ها و
          همکاری‌های صنعتی شماست.
        </motion.p>
      </section>

      {/* ===== INFO + FORM ZONE ===== */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 px-5 md:px-10 py-10">
        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-3xl bg-white/60 backdrop-blur-xl p-10 shadow-[0_20px_40px_-15px_rgba(0,132,162,0.25)]
                     border border-[#00afc128] hover:shadow-[0_25px_65px_-15px_rgba(0,132,162,0.35)] transition-all duration-700"
        >
          <h2 className="text-2xl font-semibold text-[#0079C2] mb-6">
            اطلاعات تماس
          </h2>

          <ul className="space-y-6">
            {[
              { Icon: Phone, text: "09199883772" },
              { Icon: Mail, text: "siemensplus8020@gmail.com" },
              {
                Icon: MapPin,
                text: "قزوین، شهر‌صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام، پلاک ۲۰",
              },
            ].map(({ Icon, text }, i) => (
              <li
                key={i}
                className="flex items-center gap-4 group hover:translate-x-1 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-[#00afc10e] text-[#00AFC1] group-hover:bg-[#004c970c] transition-colors">
                  <Icon size={22} />
                </div>
                <span className="select-all text-gray-700 leading-relaxed">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-[#00afc130] pt-6 text-sm text-gray-500 leading-relaxed">
            ساعت کاری: ۹ صبح تا ۵ عصر (شنبه تا چهارشنبه)
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-3xl bg-white/70 backdrop-blur-xl p-10 shadow-[0_20px_40px_-15px_rgba(0,132,162,0.25)]
                     border border-[#00afc128] hover:shadow-[0_25px_65px_-15px_rgba(0,132,162,0.35)] transition-all duration-700"
        >
          <h2 className="text-2xl font-semibold text-[#0079C2] mb-6">
            فرم تماس
          </h2>

          <form className="space-y-5">
            {[
              {
                label: "نام و نام خانوادگی",
                type: "text",
                placeholder: "نام شما...",
              },
              { label: "ایمیل", type: "email", placeholder: "ایمیل شما..." },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm mb-1 text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-transparent bg-white/80 
                             shadow-inner focus:ring-2 focus:ring-[#00AFC1]
                             focus:shadow-[0_0_15px_rgba(0,172,201,0.3)] 
                             transition-all duration-300 outline-none text-gray-800"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                پیام شما
              </label>
              <textarea
                rows={5}
                placeholder="بنویسید..."
                className="w-full px-4 py-3 rounded-xl border border-transparent bg-white/80 shadow-inner 
                           focus:ring-2 focus:ring-[#00AFC1] focus:shadow-[0_0_15px_rgba(0,172,201,0.3)]
                           resize-none transition-all duration-300 outline-none text-gray-800"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white
                         bg-linear-to-r from-[#00AFC1] to-[#004C97]
                         shadow-[0_8px_20px_-2px_rgba(0,132,162,0.4)]
                         hover:shadow-[0_0_25px_rgba(0,172,201,0.3)] 
                         transition-all duration-300"
            >
              ارسال پیام
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* ===== MAP SECTION ===== */}
      <section
        className="max-w-7xl mx-auto mt-16 mb-24 flex flex-col md:flex-row 
                     gap-8 md:gap-12 items-start justify-between px-6 md:px-10"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 space-y-4"
        >
          <h3 className="text-2xl font-bold text-[#0079C2]">
            دفتر مرکزی Siemens Plus
          </h3>
          <p className="text-gray-600 leading-relaxed">
            ما در قلب منطقه صنعتی البرز مستقر هستیم — جایی که پروژه‌های
            اتوماسیون و کنترل زیمنس‌پلاس شکل می‌گیرند. برای بازدید یا همکاری
            حضوری، می‌توانید از مسیر نقشه زیر ما رو پیدا کنید.
          </p>
          <ul className="text-gray-700 space-y-2">
            <li>
              📍 قزوین، شهر صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام،
              پلاک ۲۰
            </li>
            <li>☎️ 09199883772 </li>
            <li>📧 siemensplus8020@gmail.com </li>
          </ul>
        </motion.div>

        {/* نقشه سمت چپ - مستطیلی با glow */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 rounded-[1.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,132,162,0.25)]
               ring-1 ring-[#00AFC133] hover:shadow-[0_25px_60px_-10px_rgba(0,132,162,0.3)]
               transition-all duration-500"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d284.57077922117645!2d50.088454345482525!3d36.20180397222579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zICAg2YLYstmI24zZhtiMINi02YfYsSDYtdmG2LnYqtuMINin2YTYqNix2LLYjCDYrtuM2KfYqNin2YYg2LLaqdix24zYp9uMINix2KfYstuM2Iwg2KzZhtioINi02LHaqdiqINmF2YfYsdin2YXYjCDZvtmE2KfaqSDbstuw!5e0!3m2!1sfa!2s!4v1761992148931!5m2!1sfa!2s"
            className="w-full h-[340px] grayscale-[0.2] hover:grayscale-0 duration-700 transition-all"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </motion.div>
      </section>

      {/* ===== WAVE CTA ===== */}
      <section
        className="relative overflow-hidden py-28 bg-gradient-to-r 
                     from-[#004C97] via-[#0079C2] to-[#00AFC1] text-white text-center"
      >
        {/* Upper Wave Divider with Glow */}
        <div className="absolute -top-[1px] left-0 w-full drop-shadow-[0_-6px_25px_rgba(0,172,201,0.35)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#f9fdff"
              d="M0,288L80,272C160,256,320,224,480,186.7C640,149,800,107,960,117.3C1120,128,1280,192,1360,224L1440,256L1440,0L0,0Z"
            />
          </svg>
        </div>

        {/* CTA Content with motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 px-8"
        >
          <h3 className="text-3xl md:text-4xl text-gray-800 font-semibold mb-5 drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]">
            آماده‌ای برای شروع با 
            <span className="text-black"> Siemens Plus؟</span>
          </h3>
          <p className="text-lg mb-8 text-gray-100/90">
            همین حالا با ما تماس بگیر تا پروژه‌اتو شروع کنیم 💡
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="relative px-12 py-3.5 rounded-xl font-semibold 
                 bg-white/95 text-[#004C97] shadow-[0_8px_25px_-4px_rgba(255,255,255,0.4)]
                 border border-[#00AFC166]
                 before:absolute before:inset-0 before:rounded-xl
                 before:bg-gradient-to-r before:from-[#00AFC1] before:to-[#004C97]
                 before:opacity-0 hover:before:opacity-20 transition-all duration-300"
          >
            شروع همکاری
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
}
