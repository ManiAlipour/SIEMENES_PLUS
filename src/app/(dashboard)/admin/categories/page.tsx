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
      className="mx-auto max-w-7xl transition-colors duration-300"
    >
      <header className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-[#d7e3ef] pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#0b1f33] sm:text-2xl">
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            ساختار دسته‌بندی محصولات فروشگاه
          </p>
        </div>
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
