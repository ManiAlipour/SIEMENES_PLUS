"use client";

/**
 * Admin categories: list, add, delete.
 * API: GET /api/categories, POST/DELETE /api/admin/categories.
 */
import { useCallback } from "react";
import { useCategories } from "@/hooks/useCategories";
import CategoryForm from "./_components/CategoryForm";
import CategoriesList, { getParentNameFromList } from "./_components/CategoriesList";

export default function AdminCategoriesPage() {
  const { categories, loading, error, refetch, deleteCategory } = useCategories();

  const getParentName = useCallback(
    (parentId: string | null | undefined) =>
      getParentNameFromList(parentId, categories),
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
        <CategoryForm categories={categories} onSuccess={refetch} />
        <CategoriesList
          categories={categories}
          loading={loading}
          errorMsg={error}
          onDelete={deleteCategory}
          getParentName={getParentName}
        />
      </div>
    </div>
  );
}
