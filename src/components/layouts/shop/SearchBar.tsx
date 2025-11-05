"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("q", value);
      else params.delete("q");
      params.delete("page");
      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(handler);
  }, [value]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="جست‌وجوی محصول..."
      className="w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none shadow-sm"
    />
  );
}
