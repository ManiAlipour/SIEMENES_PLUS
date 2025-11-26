"use client";

import { useState, useEffect } from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiSliders,
  FiChevronDown,
} from "react-icons/fi";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalProducts: number;
}

export default function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalProducts,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.data) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", err);
      }
    };
    fetchCategories();
  }, []);

  const sortOptions = [
    { value: "-createdAt", label: "جدیدترین" },
    { value: "createdAt", label: "قدیمی‌ترین" },
    { value: "name", label: "نام (الف-ی)" },
    { value: "-name", label: "نام (ی-الف)" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* جستجو - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-cyan-50/30 to-primary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
        <div className="relative bg-white/80 backdrop-blur-sm border-2 border-gray-200/60 focus-within:border-primary/60 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary w-5 h-5 z-10 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی محصولات، برند، مدل..."
            className="input w-full pr-14 pl-6 py-4 text-base bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-400"
            aria-label="جستجوی محصولات"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => onSearchChange("")}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                aria-label="پاک کردن جستجو"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mobile Filter Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="lg:hidden"
      >
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl hover:border-primary/50 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <FiFilter className="w-5 h-5 text-primary" />
            <span className="font-semibold text-gray-700">
              فیلترها و مرتب‌سازی
            </span>
          </div>
          <motion.div
            animate={{ rotate: showMobileFilters ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronDown className="w-5 h-5 text-gray-500" />
          </motion.div>
        </button>
      </motion.div>

      {/* فیلترها و مرتب‌سازی - Enhanced */}
      <AnimatePresence>
        {(showMobileFilters || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-gradient-to-br from-white via-gray-50/50 to-cyan-50/30 rounded-3xl border border-gray-100/80 shadow-sm"
            >
              {/* دسته‌بندی */}
              <div className="w-full lg:flex-1 lg:w-auto">
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-primary" />
                  دسته‌بندی
                </label>
                <select
                  value={category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="input w-full py-3.5 px-4 bg-white border-2 border-gray-200 focus:border-primary rounded-2xl shadow-sm hover:shadow-md transition-all text-base"
                  aria-label="فیلتر بر اساس دسته‌بندی"
                >
                  <option value="">همه دسته‌بندی‌ها</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* مرتب‌سازی */}
              <div className="w-full lg:flex-1 lg:w-auto">
                <label
                  htmlFor="sort-select"
                  className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"
                >
                  <FiSliders className="w-4 h-4 text-primary" />
                  مرتب‌سازی
                </label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="input w-full py-3.5 px-4 bg-white border-2 border-gray-200 focus:border-primary rounded-2xl shadow-sm hover:shadow-md transition-all text-base"
                  aria-label="مرتب‌سازی محصولات"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* حالت نمایش */}
              <div className="w-full md:col-span-2 lg:w-auto lg:flex items-end gap-3">
                <label className="block text-sm font-bold text-gray-800 mb-3 lg:hidden">
                  حالت نمایش
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800 hidden lg:block">
                    نمایش:
                  </span>
                  <div className="flex items-center gap-1 border-2 border-gray-200 rounded-2xl p-1.5 bg-white shadow-sm">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onViewModeChange("grid")}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg scale-105"
                          : "text-gray-600 hover:bg-gray-100 hover:scale-105"
                      }`}
                      aria-label="نمایش شبکه‌ای"
                      aria-pressed={viewMode === "grid"}
                    >
                      <IoGridOutline className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onViewModeChange("list")}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        viewMode === "list"
                          ? "bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg scale-105"
                          : "text-gray-600 hover:bg-gray-100 hover:scale-105"
                      }`}
                      aria-label="نمایش لیستی"
                      aria-pressed={viewMode === "list"}
                    >
                      <IoListOutline className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تعداد نتایج - Enhanced */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center justify-center gap-3"
      >
        <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary/10 via-cyan-50 to-primary/10 border border-primary/20 rounded-2xl shadow-sm">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
            {totalProducts.toLocaleString("fa-IR")}
          </span>
          <span className="text-gray-700 font-semibold text-lg">
            محصول یافت شد
          </span>
        </div>
      </motion.div>
    </div>
  );
}
