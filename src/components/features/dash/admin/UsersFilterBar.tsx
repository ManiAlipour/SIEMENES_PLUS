"use client";
import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";

interface UsersFilterBarProps {
  onSearch: (query: string) => void;
  onFilter: (filter: { role: string; sort: "newest" | "oldest" }) => void;
  roles?: string[];
}

export default function UsersFilterBar({
  onSearch,
  onFilter,
  roles = ["admin", "user"],
}: UsersFilterBarProps) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value.trim());
  };

  const handleFilterChange = (
    newRole: string,
    newSort: "newest" | "oldest"
  ) => {
    setRole(newRole);
    setSort(newSort);
    onFilter({ role: newRole, sort: newSort });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white/60 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl mb-6 shadow-sm transition">
      {/* --- Search Input --- */}
      <div className="relative w-full sm:w-1/2">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="جست‌وجو بر اساس نام یا ایمیل..."
          className="w-full bg-white/80 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-700 placeholder:text-slate-400 transition"
        />
      </div>

      {/* --- Filters --- */}
      <div className="flex gap-3 items-center">
        <FiFilter className="text-slate-400 text-lg" />

        {/* Role Filter */}
        <select
          className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          value={role}
          onChange={(e) => handleFilterChange(e.target.value, sort)}
        >
          <option value="all">همه نقش‌ها</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r === "admin" ? "ادمین" : "کاربر"}
            </option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          value={sort}
          onChange={(e) =>
            handleFilterChange(role, e.target.value as "newest" | "oldest")
          }
        >
          <option value="newest">جدیدتر</option>
          <option value="oldest">قدیمی‌تر</option>
        </select>
      </div>
    </div>
  );
}
