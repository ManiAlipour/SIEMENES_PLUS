"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX, FiFilter, FiSliders } from "react-icons/fi";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import { motion } from "framer-motion";

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
    <div className="w-full space-y-5">
      {/* جستجو */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجوی محصولات، برند، مدل..."
          className="input w-full pr-12 pl-4 py-3.5 text-base bg-white border-2 border-gray-200 focus:border-primary rounded-2xl shadow-sm hover:shadow-md transition-all"
          aria-label="جستجوی محصولات"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-full"
            aria-label="پاک کردن جستجو"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      {/* فیلترها و مرتب‌سازی */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
      >
        {/* دسته‌بندی */}
        <div className="flex-1 w-full lg:w-auto">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            دسته‌بندی
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="input w-full lg:w-auto min-w-[220px] py-3 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm hover:shadow-md transition-all"
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
        <div className="flex-1 w-full lg:w-auto">
          <label
            htmlFor="sort-select"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            مرتب‌سازی
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="input w-full lg:w-auto min-w-[180px] py-3 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm hover:shadow-md transition-all"
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
        <div className="flex items-end gap-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            نمایش
          </label>
          <div className="flex items-center gap-1 border-2 border-gray-200 rounded-xl p-1 bg-white shadow-sm">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-md scale-105"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="نمایش شبکه‌ای"
              aria-pressed={viewMode === "grid"}
            >
              <IoGridOutline className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-md scale-105"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="نمایش لیستی"
              aria-pressed={viewMode === "list"}
            >
              <IoListOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* تعداد نتایج */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center gap-2 text-sm"
      >
        <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold">
          {totalProducts.toLocaleString("fa-IR")}
        </div>
        <span className="text-gray-600 font-medium">محصول یافت شد</span>
      </motion.div>
    </div>
  );
}
