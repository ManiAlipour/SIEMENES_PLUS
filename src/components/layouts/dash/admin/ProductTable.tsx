"use client";

import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiBox,
} from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

interface Product {
  _id: string;
  name: string;
  brand?: string;
  isFeatured?: boolean;
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

type Pagination = {
  limit: number;
  page: number;
  totalPage: number;
  total?: number;
};

export default function ProductTable({
  products,
  onRefresh,
  pagination,
  onPageChange,
}: {
  products: Product[];
  onRefresh: () => void;
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const getPages = () => {
    const { page, totalPage } = pagination;
    const pages: (number | string)[] = [];

    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPage - 1, page + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (page < totalPage - 2) pages.push("...");

    if (!pages.includes(totalPage)) pages.push(totalPage);

    return pages;
  };

  return (
    <>
      <div className="mt-12 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden font-vazirmatn">
        <div className="px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b bg-gray-50/80">
          <div>
            <h2 className="text-lg font-bold text-gray-800">لیست محصولات</h2>
            <p className="text-sm text-gray-500 mt-1">
              مدیریت محصولات و ویرایش یا حذف سریع آیتم‌ها
            </p>
          </div>

          <div className="text-sm text-gray-600">
            صفحه{" "}
            <span className="font-semibold text-gray-900">
              {pagination.page}
            </span>{" "}
            از{" "}
            <span className="font-semibold text-gray-900">
              {pagination.totalPage}
            </span>
            {pagination.total !== undefined && (
              <span className="mr-2 text-gray-400">
                · {pagination.total} محصول
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-600">
                <th className="py-4 px-5 text-right font-medium">نام محصول</th>
                <th className="py-4 px-5 text-right font-medium">برند</th>
                <th className="py-4 px-5 text-right font-medium">ویژه</th>
                <th className="py-4 px-5 text-right font-medium">اکشن‌ها</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <FiBox className="text-3xl text-gray-300" />
                      <p className="font-medium">
                        محصولی برای نمایش وجود ندارد
                      </p>
                      <p className="text-sm">
                        می‌تونی فیلترها رو تغییر بدی یا محصول جدید اضافه کنی.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{p.slug}</div>
                    </td>

                    <td className="py-4 px-5 text-gray-700">
                      {p.brand || "—"}
                    </td>

                    <td className="py-4 px-5">
                      {p.isFeatured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
                          <IoMdCheckmark className="text-base" />
                          ویژه
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-medium">
                          <FaTimesCircle className="text-sm" />
                          عادی
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition"
                        >
                          <FiEdit2 className="text-sm" />
                          <span className="hidden sm:inline">ویرایش</span>
                        </button>

                        <button
                          onClick={() => handleDelete(p)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100 hover:border-red-300 transition"
                        >
                          <FiTrash2 className="text-sm" />
                          <span className="hidden sm:inline">حذف</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPage > 1 && (
          <div className="px-5 py-4 border-t bg-white flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              صفحه {pagination.page} از {pagination.totalPage}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                disabled={pagination.page === 1}
                onClick={() => onPageChange(pagination.page)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FiChevronRight />
                قبلی
              </button>

              {getPages().map((item, index) =>
                item === "..." ? (
                  <span key={`dots-${index}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => onPageChange(item as number)}
                    className={`min-w-10 h-10 rounded-lg text-sm font-medium transition ${
                      pagination.page === item
                        ? "bg-gray-900 text-white"
                        : "border bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                disabled={pagination.page === pagination.totalPage}
                onClick={() => onPageChange(pagination.page + 1)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                بعدی
                <FiChevronLeft />
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsEditOpen(false)}
          onUpdated={onRefresh}
        />
      )}

      {isDeleteOpen && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={onRefresh}
        />
      )}
    </>
  );
}
