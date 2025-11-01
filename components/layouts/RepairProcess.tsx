"use client";

import { motion } from "framer-motion";
import {
  FaTools,
  FaSearchPlus,
  FaThumbsUp,
  FaShippingFast,
  FaUmbrella,
  FaCalculator,
} from "react-icons/fa";

export default function RepairProcess() {
  const steps = [
    {
      icon: <FaCalculator />,
      title: "برآورد هزینه قبل از شروع تعمیرات",
      step: 1,
    },
    { icon: <FaTools />, title: "تعمیرات به‌صورت روشمند و علمی", step: 2 },
    {
      icon: <FaUmbrella />,
      title: "سرویس و تمیز نمودن تجهیزات الکترونیک",
      step: 3,
    },
    {
      icon: <FaSearchPlus />,
      title: "آنالیز و عیب‌یابی قطعات الکترونیک",
      step: 4,
    },
    { icon: <FaThumbsUp />, title: "تست محصول تعمیر شده", step: 5 },
    { icon: <FaShippingFast />, title: "ارسال رایگان", step: 6 },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-[#0b1730] text-white">
      {/* لایه رنگ صنعتی نیمه‌تیره برای عمق */}
      <div className="absolute inset-0 bg-[#002b59]/80" />

      {/* موج نوری سینوسی */}
      <div className="absolute inset-0 z-0 opacity-40">
        <svg viewBox="0 0 1200 400" className="w-full h-full">
          <defs>
            <linearGradient
              id="pulseGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#00A9E0" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#00A9E0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00A9E0" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 C200,150 400,250 600,200 C800,150 1000,250 1200,200"
            stroke="url(#pulseGradient)"
            strokeWidth="3"
            fill="none"
          >
            <animate
              attributeName="stroke-width"
              values="2;4;2"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* عنوان سکشن */}
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#00A9E0]">
          فرآیند تعمیرات گروه مهندسی{" "}
          <span className="text-[#00CFB9]">زیمنس پلاس</span>
        </h2>
        <div className="mt-3 w-28 h-1 bg-[#00A9E0] mx-auto rounded-full shadow-[0_0_14px_#00A9E0]" />
      </div>

      {/* مراحل */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 px-4 text-center items-start">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center group"
          >
            {/* آیکون صنعتی */}
            <div
              className="relative w-16 h-16 flex items-center justify-center rounded-full bg-linear-to-b
             from-[#0b1730] to-[#002b59] border-2 border-[#00A9E0] shadow-[0_0_10px_#00A9E0]/40 mb-3"
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-[#00A9E0] text-3xl"
              >
                {item.icon}
              </motion.span>

              <span className="absolute inset-0 rounded-full bg-[#00A9E0]/10 blur-lg opacity-0 group-hover:opacity-100 transition" />
            </div>

            {/* توضیحات */}
            <p className="text-sm sm:text-base font-medium text-white/85 leading-snug max-w-[140px]">
              {item.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
