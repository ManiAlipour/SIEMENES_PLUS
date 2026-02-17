"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function HeaderSearchbar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = inputRef.current?.value?.trim();
      if (query) {
        router.push(`/shop?search=${encodeURIComponent(query)}`);
      }
    },
    [router]
  );

  return (
    <form onSubmit={handleSubmit} className="relative">
      <FiSearch className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        placeholder="جستجو در محصولات..."
        autoComplete="off"
        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:border-cyan-500 outline-none transition"
        aria-label="جستجو در محصولات"
      />
    </form>
  );
}
