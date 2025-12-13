"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function HeaderSearchbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <FiSearch className="absolute right-3 top-3 text-slate-400" />
      <input
        type="text"
        placeholder="جستجو در محصولات..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:border-cyan-500 outline-none transition"
      />
    </form>
  );
}
