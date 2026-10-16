"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
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
      if (!res.ok) throw new Error(json.message || "خطا در دریافت دسته‌ها");
      setCategories(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت دسته‌ها!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!window.confirm("آیا از حذف این دسته مطمئن هستید؟")) return;
      try {
        const res = await fetch(`${API_ADMIN_CATEGORIES}/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success("دسته با موفقیت حذف شد.");
          await refetch();
        } else {
          const data = await res.json();
          toast.error(data.message || "حذف دسته انجام نشد.");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "حذف دسته با خطا مواجه شد!");
      }
    },
    [refetch]
  );

  return { categories, loading, error, refetch, deleteCategory };
}
