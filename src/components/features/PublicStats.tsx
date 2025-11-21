"use client";

import { useState, useEffect } from "react";
import { FiTrendingUp, FiEye, FiPackage, FiUsers, FiSearch, FiFileText } from "react-icons/fi";
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
        console.error("خطا در دریافت آمار:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-white to-primary/5">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
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
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FiFileText,
      label: "مقالات",
      value: stats.totalPosts,
      color: "from-green-500 to-green-600",
    },
    {
      icon: FiUsers,
      label: "کاربران",
      value: stats.totalUsers,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FiEye,
      label: "بازدید صفحات",
      value: stats.totalPageViews,
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: FiTrendingUp,
      label: "بازدید محصولات",
      value: stats.totalProductViews,
      color: "from-red-500 to-red-600",
    },
    {
      icon: FiSearch,
      label: "جستجوها",
      value: stats.totalSearches,
      color: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-white to-primary/5">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            آمار و اطلاعات سایت
          </h2>
          <p className="text-gray-600">
            آمار کلی فعالیت‌های سایت و کاربران
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {formatNumber(item.value)}
                </div>
                <div className="text-xs md:text-sm text-gray-600">{item.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

