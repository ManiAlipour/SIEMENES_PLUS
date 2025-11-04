"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen font-[Vazirmatn] bg-linear-to-b from-white via-[#f9fdff] to-[#e8faff] text-[#1f2937] overflow-hidden">
      {/* ==== Title Section ==== */}
      <section className="max-w-6xl mx-auto pt-16 md:pt-24 pb-12 px-4 md:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-highlight"
        >
          تماس با زیمنس‌پلاس
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 text-gray-500 text-lg leading-relaxed"
        >
          اگه پرسشی داری یا نیاز به مشاوره فنی داری، فرم زیر رو پر کن یا مستقیم
          تماس بگیر.
        </motion.p>
      </section>

      {/* ==== Dual Cards (Form + Info) ==== */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-14 px-4 md:px-8 pb-20">
        {/* --- Info Card --- */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-2xl bg-white/90 backdrop-blur-sm p-8 md:p-10 
                     border-t-2 border-l-2 border-cyan-100 ring-1 ring-cyan-50
                     shadow-[0_15px_40px_-15px_rgba(0,132,162,0.25)]
                     hover:shadow-[0_20px_50px_-15px_rgba(0,132,162,0.35)]
                     transition-all duration-500"
        >
          <h2 className="text-2xl font-semibold text-highlight mb-6">
            اطلاعات تماس
          </h2>

          <ul className="space-y-5 text-gray-700">
            {[
              { Icon: Phone, text: "09199883772" },
              { Icon: Mail, text: "siemensplus8020@gmail.com" },
              {
                Icon: MapPin,
                text: "قزوین، شهر صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام، پلاک ۲۰",
              },
            ].map(({ Icon, text }, i) => (
              <li
                key={i}
                className="flex items-center gap-4 group hover:translate-x-1 transition-all duration-300"
              >
                <div className="p-3 bg-teal-50 rounded-xl text-[#00AFC1] group-hover:bg-[#00afc10c] transition-colors">
                  <Icon size={22} />
                </div>
                <span className="select-all leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* --- Form Card --- */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-2xl bg-white/90 backdrop-blur-sm p-8 md:p-10 
                     border-t-2 border-l-2 border-cyan-100 ring-1 ring-cyan-50
                     shadow-[0_15px_40px_-15px_rgba(0,132,162,0.25)]
                     hover:shadow-[0_20px_50px_-15px_rgba(0,132,162,0.35)]
                     transition-all duration-500"
        >
          <h2 className="text-2xl font-semibold text-highlight mb-6">
            فرم تماس
          </h2>

          <form className="space-y-5">
            {[
              {
                label: "نام و نام خانوادگی",
                type: "text",
                placeholder: "نام شما...",
              },
              { label: "ایمیل", type: "email", placeholder: "ایمیل شما..." },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm mb-1 text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full p-2  border-gray-600 rounded-xl shadow-sm transition-all duration-300
                             focus:ring-2 focus:ring-teal-400 focus:border-transparent 
                             focus:shadow-[0_0_10px_rgba(0,172,201,0.3)]"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                پیام شما
              </label>
              <textarea
                rows={5}
                className="w-full rounded-xl border-gray-200 shadow-sm transition-all duration-300
                           focus:ring-2 focus:ring-teal-400 focus:border-transparent 
                           focus:shadow-[0_0_10px_rgba(0,172,201,0.3)] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-medium text-white 
                         bg-linear-to-r from-cyan-500 to-blue-500 
                         shadow-md hover:scale-[1.03] active:scale-100
                         transition-all duration-300"
            >
              ارسال پیام
            </button>
          </form>
        </motion.div>
      </section>

      {/* ==== Map Section ==== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto mb-24 px-4 md:px-0 rounded-2xl overflow-hidden
                   shadow-[0_20px_40px_-10px_rgba(0,132,162,0.25)] 
                   ring-1 ring-cyan-50"
      >
        <iframe
          title="siemensplus-map"
          src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d284.57077922117645!2d50.088454345482525!3d36.20180397222579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zICAg2YLYstmI24zZhtiMINi02YfYsSDYtdmG2LnYqtuMINin2YTYqNix2LLYjCDYrtuM2KfYqNin2YYg2LLaqdix24zYp9uMINix2KfYstuM2Iwg2KzZhtioINi02LHaqdiqINmF2YfYsdin2YXYjCDZvtmE2KfaqSDbstuw!5e0!3m2!1sfa!2s!4v1761992148931!5m2!1sfa!2s"
          className="relative z-10 w-full h-[360px] grayscale-[0.25] hover:grayscale-0 transition-all duration-700 rounded-[16px]"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </motion.section>

      {/* ==== CTA Section ==== */}
      <section
        className="relative py-24 text-white overflow-hidden 
                         bg-linear-to-r from-[#004E8A] via-highlight to-[#00AFC1] 
                         border-t border-[#00a7c381]"
      >
        {/* Wave */}
        <div
          className="absolute top-0 left-0 w-full -translate-y-1 
                        drop-shadow-[0_-6px_15px_rgba(0,172,201,0.25)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#fff"
              d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,176C672,160,768,128,864,128C960,128,1056,160,1152,181.3C1248,203,1344,213,1392,218.7L1440,224L1440,0L0,0Z"
            ></path>
          </svg>
        </div>

        {/* CTA Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto text-center px-6"
        >
          <h3 className="text-3xl md:text-4xl text-black font-bold mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
            ایده یا پروژه داری؟
          </h3>
          <p className="mb-8 text-lg text-black leading-relaxed">
            تیم زیمنس پلاس آماده همکاری در پروژه‌های صنعتی و اتوماسیونه.
          </p>

          <button
            className="bg-white text-highlight px-8 py-3 font-semibold rounded-xl
                       shadow-lg hover:scale-[1.06] 
                       hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] 
                       active:scale-100 transition-all duration-300"
          >
            شروع همکاری
          </button>
        </motion.div>
      </section>
    </main>
  );
}
