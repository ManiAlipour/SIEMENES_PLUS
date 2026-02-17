"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  showFilters?: boolean;
  onToggleFilters?: () => void;
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
  showFilters = false,
  onToggleFilters,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchChange = useCallback(
    (value: string, immediate = false) => {
      setLocalSearch(value);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (immediate) {
        onSearchChange(value);
      } else {
        debounceRef.current = setTimeout(() => {
          onSearchChange(value);
          debounceRef.current = null;
        }, 350);
      }
    },
    [onSearchChange]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const sortOptions = [
    { value: "-createdAt", label: "جدیدترین" },
    { value: "createdAt", label: "قدیمی‌ترین" },
    { value: "name", label: "نام (الف-ی)" },
    { value: "-name", label: "نام (ی-الف)" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar - Prominent */}
      <div className="relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-cyan-400/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-white border-2 border-gray-200 focus-within:border-primary rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
            <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
              <FiSearch className="w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="جستجوی محصولات، برند، مدل..."
              className="w-full pr-14 pl-5 py-5 md:py-6 text-base md:text-lg bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 text-gray-900 font-medium"
              aria-label="جستجوی محصولات"
            />
            {localSearch && (
                <button
                    onClick={() => handleSearchChange("", true)}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                    aria-label="پاک کردن جستجو"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
          </div>
        </div>
      </div>

      {/* Quick Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Mobile Filter Toggle */}
        {onToggleFilters && (
          <button
            onClick={onToggleFilters}
            className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-gray-700"
          >
            <FiFilter className="w-5 h-5 text-primary" />
            <span>فیلترها</span>
            <span
              className={`inline-block transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
            >
              <FiChevronDown className="w-4 h-4" />
            </span>
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 border-2 border-gray-200 rounded-2xl p-1 bg-white shadow-md">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="نمایش شبکه‌ای"
            aria-pressed={viewMode === "grid"}
          >
            <IoGridOutline className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
              viewMode === "list"
                ? "bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="نمایش لیستی"
            aria-pressed={viewMode === "list"}
          >
            <IoListOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Results Count */}
        <div className="flex-1 flex items-center justify-end gap-2 px-5 py-3 bg-gradient-to-r from-primary/10 via-cyan-50 to-blue-50 border-2 border-primary/20 rounded-2xl shadow-md">
          <span className="text-2xl md:text-3xl font-black text-primary">
            {totalProducts.toLocaleString("fa-IR")}
          </span>
          <span className="text-sm md:text-base font-bold text-gray-700">
            محصول
          </span>
        </div>
      </div>

      {/* Filters Panel - Mobile & Desktop */}
      <AnimatePresence>
        {(showFilters || isDesktop) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white rounded-3xl border-2 border-gray-200 shadow-lg">
              {/* Category Filter */}
              <div className="w-full">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <FiFilter className="w-4 h-4 text-primary" />
                  </div>
                  دسته‌بندی
                </label>
                <select
                  value={category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full py-3.5 px-4 bg-white border-2 border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl shadow-sm hover:shadow-md transition-all text-base text-gray-900 font-medium cursor-pointer"
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

              {/* Sort Filter */}
              <div className="w-full">
                <label
                  htmlFor="sort-select"
                  className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"
                >
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <FiSliders className="w-4 h-4 text-primary" />
                  </div>
                  مرتب‌سازی
                </label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full py-3.5 px-4 bg-white border-2 border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl shadow-sm hover:shadow-md transition-all text-base text-gray-900 font-medium cursor-pointer"
                  aria-label="مرتب‌سازی محصولات"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
