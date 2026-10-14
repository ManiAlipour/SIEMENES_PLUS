"use client";

/**
 * Admin categories: list, add, delete.
 * API: GET /api/categories, POST/DELETE /api/admin/categories.
 */
import { useCallback } from "react";
import { useCategories } from "@/hooks/useCategories";
import CategoryForm from "./_components/CategoryForm";
import CategoriesList, { getParentNameFromList } from "./_components/CategoriesList";
import AdminPageHeading from "@/components/layouts/dash/admin/AdminPageHeading";
import { FolderTree } from "lucide-react";

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
      className="mx-auto max-w-[1440px] space-y-5 transition-colors duration-300"
    >
      <AdminPageHeading title="دسته‌بندی محصولات" description="ساختار فروشگاه را مرتب کنید، زیردسته بسازید و دسته‌های شاخص را مشخص کنید." icon={FolderTree} eyebrow="کاتالوگ محصولات" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(340px,.8fr)_minmax(0,1.2fr)]">
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
