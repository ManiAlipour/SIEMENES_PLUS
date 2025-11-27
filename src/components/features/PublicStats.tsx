"use client";

import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiEye,
  FiPackage,
  FiUsers,
  FiSearch,
  FiFileText,
} from "react-icons/fi";
import { motion } from "framer-motion";

interface StatsData {
  totalProducts: number;
  totalPosts: number;
  totalUsers: number;
  totalPageViews: number;
  totalProductViews: number;
  totalSearches: number;
}

export default function PublicStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics/public?type=overview");
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- Loading Skeleton ---
  if (loading) {
    return (
      <section className="py-8 md:py-16 bg-gradient-to-br from-primary/5 via-white to-primary/5">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm animate-pulse flex flex-row md:flex-col items-center gap-4"
              >
                {/* Icon placeholder */}
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
                {/* Text placeholder */}
                <div className="flex-1 flex flex-col md:items-center gap-2 w-full">
                  <div className="h-6 bg-gray-200 rounded w-20 md:w-16" />
                  <div className="h-4 bg-gray-200 rounded w-24 md:w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const statItems = [
    {
      icon: FiPackage,
      label: "محصولات",
      value: stats.totalProducts,
      color: "from-blue-500 to-blue-600 shadow-blue-500/20",
    },
    {
      icon: FiFileText,
      label: "مقالات",
      value: stats.totalPosts,
      color: "from-green-500 to-green-600 shadow-green-500/20",
    },
    {
      icon: FiUsers,
      label: "کاربران",
      value: stats.totalUsers,
      color: "from-purple-500 to-purple-600 shadow-purple-500/20",
    },
    {
      icon: FiEye,
      label: "بازدید صفحات",
      value: stats.totalPageViews,
      color: "from-orange-500 to-orange-600 shadow-orange-500/20",
    },
    {
      icon: FiTrendingUp,
      label: "بازدید محصولات",
      value: stats.totalProductViews,
      color: "from-red-500 to-red-600 shadow-red-500/20",
    },
    {
      icon: FiSearch,
      label: "جستجوها",
      value: stats.totalSearches,
      color: "from-teal-500 to-teal-600 shadow-teal-500/20",
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-gradient-to-br from-primary/5 via-white to-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            آمار و اطلاعات سایت
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            نگاهی به رشد و فعالیت‌های اخیر در پلتفرم ما
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="
                  relative overflow-hidden group
                  bg-white rounded-2xl border border-gray-100
                  p-3 md:p-6
                  hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300
                "
              >
                {/* Layout Container: Row on Mobile, Col on Desktop */}
                <div className="flex flex-row md:flex-col items-center gap-3 md:gap-4 h-full">
                  {/* Icon Wrapper */}
                  <div
                    className={`
                    flex-shrink-0
                    w-10 h-10 md:w-14 md:h-14 
                    rounded-xl md:rounded-2xl 
                    bg-gradient-to-br ${item.color} 
                    flex items-center justify-center 
                    shadow-lg md:mb-2 transition-transform group-hover:scale-110 duration-300
                  `}
                  >
                    <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col items-start md:items-center justify-center min-w-0">
                    <div className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 tabular-nums leading-tight">
                      {formatNumber(item.value)}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 font-medium mt-0.5 md:mt-1 truncate w-full text-right md:text-center">
                      {item.label}
                    </div>
                  </div>
                </div>

                {/* Decorative Background Blob (Desktop Only) */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full -z-10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
