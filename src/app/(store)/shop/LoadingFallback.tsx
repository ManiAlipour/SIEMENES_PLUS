"use client";

import { motion } from "framer-motion";

export default function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] backdrop-blur-md bg-white/50 text-gray-700 font-vazirmatn">
      {/* Spinning loader */}
      <motion.div
        aria-label="loading-indicator"
        className="relative w-16 h-16 mb-6"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-300" />
        {/* Accent ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-t-[#06b6d4] border-transparent" />
      </motion.div>

      {/* Text section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="text-sm tracking-wide text-gray-500">
          در حال بارگذاری فروشگاه...
        </p>
        <p className="text-xs text-gray-400 mt-2">
          system calculating inventory & pricing matrix ⚙️
        </p>
      </motion.div>
    </div>
  );
}
