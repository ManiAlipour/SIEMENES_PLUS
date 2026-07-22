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
      iconBg: "from-[#004c97] to-[#0079c2]",
      accent: "bg-[#004c97]",
      soft: "bg-[#e8f1fa]",
      text: "text-[#004c97]",
    },
    warn: {
      iconBg: "from-amber-500 to-amber-600",
      accent: "bg-amber-500",
      soft: "bg-amber-50",
      text: "text-amber-600",
    },
    danger: {
      iconBg: "from-rose-500 to-rose-600",
      accent: "bg-rose-500",
      soft: "bg-rose-50",
      text: "text-rose-600",
    },
    success: {
      iconBg: "from-emerald-500 to-emerald-600",
      accent: "bg-emerald-500",
      soft: "bg-emerald-50",
      text: "text-emerald-600",
    },
  };

  const colors = colorMap[color];
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("fa-IR").format(num);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="admin-card group relative overflow-hidden p-5"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${colors.accent} opacity-80`}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#475569]">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-[#94a3b8]">{desc}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors.iconBg} text-white shadow-md`}
        >
          {icon}
        </div>
      </div>

      <div className={`text-3xl font-extrabold ${colors.text}`}>
        {formatNumber(count)}
      </div>

      {trend !== undefined && (
        <div className={`mt-3 flex items-center gap-1.5 text-xs ${colors.text}`}>
          {trend >= 0 ? (
            <FiTrendingUp className="h-3.5 w-3.5" />
          ) : (
            <FiTrendingDown className="h-3.5 w-3.5" />
          )}
          <span className="font-semibold">
            {trend >= 0 ? "+" : ""}
            {trend}% نسبت به ماه قبل
          </span>
        </div>
      )}
    </motion.div>
  );
}
