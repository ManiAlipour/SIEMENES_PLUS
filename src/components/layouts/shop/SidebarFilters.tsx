"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarFiltersProps {
  selectedCategory: string;
  selectedBrand: string;
}

const CATEGORY_LIST = [
  "ماژول‌ صنعتی",
  "سنسور",
  "درایو و کنترل‌سرعت",
  "منبع تغذیه",
  "تجهیزات تابلو برق",
];

const BRAND_LIST = ["Siemens", "Omron", "Schneider", "Control‑Room", "Delta"];

export default function SidebarFilters({
  selectedCategory,
  selectedBrand,
}: SidebarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  // تابع کمکی برای آپدیت Query
  const updateFilter = (type: "category" | "brand", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(type);
    if (current === value) params.delete(type);
    else params.set(type, value);

    params.delete("page"); // وقتی فیلتر عوض میشه، صفحه باید از ۱ شروع شه

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const isActive = useMemo(
    () => ({
      category: (v: string) => selectedCategory === v,
      brand: (v: string) => selectedBrand === v,
    }),
    [selectedCategory, selectedBrand]
  );

  return (
    <aside
      className="bg-white border border-gray-200 rounded-xl shadow-sm
                 p-5 lg:p-6 lg:sticky lg:top-24"
    >
      {/* mobile toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="lg:hidden w-full flex items-center justify-between text-gray-700 text-sm font-medium mb-3"
      >
        فیلترها
        <span
          className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-7"
          >
            {/* Category Section */}
            <div>
              <h3 className="mb-2 text-gray-800 font-semibold">دسته‌بندی</h3>
              <ul className="flex flex-col gap-1.5">
                {CATEGORY_LIST.map((cat) => (
                  <li key={cat}>
                    <button
                      aria-label={`فیلتر ${cat}`}
                      onClick={() => updateFilter("category", cat)}
                      className={`w-full text-start text-sm rounded-md px-2 py-1.5
                        transition-colors duration-150 ${
                          isActive.category(cat)
                            ? "bg-teal-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand Section */}
            <div>
              <h3 className="mb-2 text-gray-800 font-semibold">برند</h3>
              <ul className="flex flex-col gap-1.5">
                {BRAND_LIST.map((b) => (
                  <li key={b}>
                    <button
                      aria-label={`برند ${b}`}
                      onClick={() => updateFilter("brand", b)}
                      className={`w-full text-start text-sm rounded-md px-2 py-1.5
                        transition-colors duration-150 ${
                          isActive.brand(b)
                            ? "bg-cyan-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {b}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Loading overlay هنگام در حال تغییر بودن state */}
            {isPending && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-lg animate-pulse" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
