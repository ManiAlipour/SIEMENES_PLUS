"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiNavigation,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function LocationSection() {
  const [copied, setCopied] = useState(false);
  const addressText =
    "قزوین – شهر صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام، پلاک ۲۰";

  const handleCopyAddress = async () => {
    try {
      // Modern way
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(addressText);
      } else {
        // Legacy Fallback
        const textArea = document.createElement("textarea");
        textArea.value = addressText;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (!successful) throw new Error("Copy failed");
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-slate-50 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            دفتر مرکزی <span className="text-cyan-600">زیمنس</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto"
          >
            برای مشاوره حضوری و بازدید از جدیدترین تجهیزات اتوماسیون صنعتی،
            مشتاق دیدار شما هستیم.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              {/* Address Box */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                    <FiMapPin size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">آدرس ما</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base pr-2 border-r-2 border-slate-100">
                  {addressText}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors"
                  >
                    {copied ? (
                      <FiCheck className="text-green-600" />
                    ) : (
                      <FiCopy />
                    )}
                    {copied ? "کپی شد!" : "کپی آدرس"}
                  </button>
                  <a
                    href="https://maps.app.goo.gl/o6YcJ5tgHwaNtraT6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-medium hover:bg-cyan-100 transition-colors"
                  >
                    <FiNavigation />
                    مسیریابی
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100 mb-8" />

              {/* Contact Info Grid */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      تلفن تماس
                    </h4>
                    <p
                      dir="ltr"
                      className="text-slate-600 font-mono text-sm sm:text-base text-right"
                    >
                      028 - 3224 5678
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      پاسخگویی در ساعات اداری
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      ساعت کاری
                    </h4>
                    <p className="text-slate-600 text-sm">
                      شنبه تا چهارشنبه:{" "}
                      <span className="font-bold text-slate-800">
                        ۹:۰۰ تا ۱۷:۰۰
                      </span>
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      پنج‌شنبه‌ها:{" "}
                      <span className="font-bold text-slate-800">
                        ۹:۰۰ تا ۱۳:۰۰
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple CTA Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-sm text-slate-300 mb-2">
                نیاز به هماهنگی قبل از بازدید دارید؟
              </p>
              <button
                className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition
               flex items-center gap-2"
              >
                تماس با واحد فروش <span className="text-lg">←</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Map Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 h-full min-h-[400px] lg:min-h-[500px] relative"
          >
            {/* Map Container */}
            <div className="absolute inset-0 bg-white p-2 rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-slate-200">
                <iframe
                  title="siemensplus-map"
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d284.57077922117645!2d50.088454345482525!3d36.20180397222579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zICAg2YLYstmI24zZhtiMINi02YfYsSDYtdmG2LnYqtuMINin2YTYqNix2LLYjCDYrtuM2KfYqNin2YYg2LLaqdix24zYp9uMINix2KfYstuM2Iwg2KzZhtioINi02LHaqdiqINmF2YfYsdin2YXYjCDZvtmE2KfaqSDbstuw!5e0!3m2!1sfa!2s!4v1761992148931!5m2!1sfa!2s"
                  className="relative z-10 w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity duration-700"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 text-xs font-bold text-slate-800 hidden sm:block">
                  زیمنس پلاس | Siemens Plus
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
