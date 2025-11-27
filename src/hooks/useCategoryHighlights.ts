"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface HighlightedCategory {
  id: string;
  title: string;
  products: Product[];
}

interface UseCategoryHighlightsReturn {
  categories: HighlightedCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategoryHighlights(): UseCategoryHighlightsReturn {
  const [categories, setCategories] = useState<HighlightedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/categories/highlights");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "خطا در دریافت هایلایت دسته‌بندی‌ها");
      }

      setCategories(data.data || []);
    } catch (err) {
      setError((err as Error).message || "خطا در دریافت هایلایت دسته‌بندی‌ها");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
