"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface IInfoCardProps {
  title: string;
  desc: string;
  count: number;
  color: "primary" | "warn" | "danger" | "success";
  trend?: number;
  icon?: React.ReactNode;
}

export default function InfoCard({
  title,
  desc,
  count,
  color,
  trend,
  icon,
}: IInfoCardProps) {
  const colorMap = {
    primary: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    warn: {
      gradient: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
    },
    danger: {
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
    },
    success: {
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
  };

  const colors = colorMap[color];
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-2xl p-6 bg-white border-2 ${colors.border} shadow-sm hover:shadow-xl transition-all duration-300`}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">{title}</h3>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>

        {/* Icon */}
        {icon ? (
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg`}
          >
            {icon}
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}
          >
            <span className="text-white font-bold text-lg">
              {count.toString().slice(0, 1)}
            </span>
          </div>
        )}
      </div>

      {/* Count */}
      <div className="mb-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-extrabold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
        >
          {formatNumber(count)}
        </motion.div>
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-2">
          {trend >= 0 ? (
            <FiTrendingUp className={`w-4 h-4 ${colors.text}`} />
          ) : (
            <FiTrendingDown className={`w-4 h-4 ${colors.text}`} />
          )}
          <span className={`text-xs font-semibold ${colors.text}`}>
            {trend >= 0 ? "+" : ""}
            {trend}% نسبت به ماه قبل
          </span>
        </div>
      )}

      {/* Accent Line */}
      <div
        className={`absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right`}
      />
    </motion.div>
  );
}
