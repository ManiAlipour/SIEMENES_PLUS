"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/types/category";

const API_CATEGORIES = "/api/categories";
const API_ADMIN_CATEGORIES = "/api/admin/categories";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_CATEGORIES);
      const json = await res.json();
      setCategories(json.data ?? []);
      if (!res.ok) setError(json.message || "خطا در دریافت دسته‌ها");
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت دسته‌ها!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!confirm("آیا از حذف این دسته مطمئن هستید؟")) return;
      try {
        const res = await fetch(`${API_ADMIN_CATEGORIES}/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await refetch();
        } else {
          const data = await res.json();
          alert(data.message || "حذف دسته با خطا مواجه شد!");
        }
      } catch (err) {
        console.error(err);
        alert("حذف دسته با خطا مواجه شد!");
      }
    },
    [refetch]
  );

  return { categories, loading, error, refetch, deleteCategory };
}
