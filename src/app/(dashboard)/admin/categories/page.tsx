"use client";

/**
 * Admin categories page: list categories, add new, delete by id.
 * Data: GET /api/categories, POST /api/admin/categories, DELETE /api/admin/categories/[id].
 */
import { useEffect, useState, useCallback } from "react";
import type { Category } from "./_components/types";
import CategoryForm from "./_components/CategoryForm";
import CategoriesList, { getParentNameFromList } from "./_components/CategoriesList";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.data ?? []);
    } catch (err) {
      console.error(err);
      setErrorMsg("خطا در دریافت دسته‌ها!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("آیا از حذف این دسته مطمئن هستید؟")) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("حذف دسته با خطا مواجه شد!");
    }
  }, [fetchCategories]);

  const getParentName = useCallback(
    (parentId: string | null | undefined) => getParentNameFromList(parentId, categories),
    [categories]
  );

  return (
    <div
      dir="rtl"
      className="relative z-0 min-h-screen font-vazirmatn bg-linear-to-br from-white via-slate-50 to-cyan-50/30 p-2 sm:p-4 md:p-6 lg:p-8 transition-colors duration-300"
    >
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 border-b border-slate-200 pb-3 gap-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">
          مدیریت دسته‌بندی‌ها
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <CategoryForm categories={categories} onSuccess={fetchCategories} />
        <CategoriesList
          categories={categories}
          loading={loading}
          errorMsg={errorMsg}
          onDelete={handleDelete}
          getParentName={getParentName}
        />
      </div>
    </div>
  );
}
