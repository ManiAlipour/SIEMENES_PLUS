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
    { icon: <FaTools />, title: "تعمیرات به صورت روشمند و علمی", step: 2 },
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
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Section heading */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#004C97]">
          فرآیند تعمیرات گروه مهندسی{" "}
          <span className="text-[#00A9E0]">زیمنس پلاس</span>
        </h2>
        <div className="mt-3 w-28 h-1 bg-[#00A9E0] mx-auto rounded"></div>
      </div>

      {/* Step-by-step path */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 px-4 text-center relative">
        {/* Connector line between steps */}
        <div className="absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-[#00A9E0]/30 via-[#00A9E0]/60 to-[#00A9E0]/30 animate-[pulseLine_3s_ease-in-out_infinite]" />
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center relative z-10"
          >
            <div className="bg-white border-2 border-[#00A9E0] rounded-full p-4 text-[#00A9E0] text-3xl shadow-md mb-3 hover:shadow-blue-200 transition-shadow">
              {item.icon}
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700 leading-snug max-w-[140px]">
              {item.title}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Subtle wave animation for the connector line */}
      <style jsx>{`
        @keyframes pulseLine {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
