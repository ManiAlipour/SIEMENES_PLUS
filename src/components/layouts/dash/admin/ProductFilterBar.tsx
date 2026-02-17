"use client";

import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

interface ProductFilterBarProps {
  onSearch: (value: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
}

export default function ProductFilterBar({
  onSearch,
  onFilterChange,
}: ProductFilterBarProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch(search.trim());
  };

  const handleFilterUpdate = () => {
    onFilterChange({ status, category });
  };

  return (
    <div className="w-full rounded-2xl backdrop-blur-lg bg-white/70 border border-[#e5e7eb]/60 shadow-sm p-4 flex flex-col gap-3 mb-6 transition-all duration-300">
      {/* Main search bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search box */}
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-[#e5e7eb]/60 rounded-xl px-3 py-2 w-full sm:w-1/3 shadow-inner">
          <FiSearch size={20} className="text-[#6b7280]" />
          <input
            type="text"
            placeholder="جستجوی محصول..."
            className="bg-transparent w-full outline-none text-sm text-meuted"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-primary to-[#0e7490] text-white hover:brightness-110 shadow-[0_2px_10px_rgba(6,182,212,0.3)] transition duration-300"
        >
          <FiFilter size={18} />
          فیلترها
          <IoIosArrowDown
            size={16}
            className={`transition-transform duration-300 ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex flex-wrap gap-4 mt-3 animate-fadeIn">
          {/* Status filter */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-sm text-[#6b7280] font-medium">
              وضعیت محصول
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                handleFilterUpdate();
              }}
              className="bg-white/60 backdrop-blur-md border border-[#e5e7eb]/60 rounded-lg px-3 py-2 text-sm text-meuted focus:border-primary transition"
            >
              <option value="">همه</option>
              <option value="available">موجود</option>
              <option value="unavailable">ناموجود</option>
              <option value="discount">تخفیف‌دار</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-sm text-[#6b7280] font-medium">
              دسته‌بندی
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                handleFilterUpdate();
              }}
              className="bg-white/60 backdrop-blur-md border border-[#e5e7eb]/60 rounded-lg px-3 py-2 text-sm text-meuted focus:border-primary transition"
            >
              <option value="">همه</option>
              <option value="light">روشنایی صنعتی</option>
              <option value="motor">موتور و سیم‌پیچ</option>
              <option value="control">کنترل هوشمند</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
