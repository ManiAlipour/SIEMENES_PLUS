"use client";

import { FiBox, FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  brand?: string;
  isFeatured?: boolean;
}

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <div
      className="mt-12 relative z-10 rounded-2xl bg-white/90 border border-[#e5e7eb]/60
                 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden font-vazirmatn"
    >
      {/* ===== Header Section ===== */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-white to-[#f8fafc] border-b border-[#e5e7eb]/70">
        <div className="flex items-center gap-2 text-[#0f172a] font-semibold tracking-tight">
          <FiBox className="w-5 h-5 text-[#06b6d4]" />
          <span>فهرست محصولات</span>
        </div>
        <span className="text-sm text-[#6b7280] font-medium">
          {products.length} آیتم
        </span>
      </div>

      {/* ===== Desktop Table View ===== */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-[#d1d5db] scrollbar-track-transparent">
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#e5e7eb]/80 text-[#111827] font-semibold">
            <tr>
              <th className="py-3 px-5 text-right">نام محصول</th>
              <th className="py-3 px-5 text-right hidden md:table-cell">
                برند
              </th>
              <th className="py-3 px-5 text-right hidden lg:table-cell">
                پیشنهادی
              </th>
              <th className="py-3 px-5 text-right">اکشن‌ها</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-[#9ca3af] font-medium"
                >
                  هیچ محصولی یافت نشد.
                </td>
              </tr>
            ) : (
              products.map((p, i) => (
                <tr
                  key={p._id}
                  className={`transition-all duration-200 ${
                    i % 2 === 0
                      ? "bg-gradient-to-r from-white to-[#f9fafb]"
                      : "bg-gradient-to-r from-[#fefefe] to-[#f9fafb]"
                  } hover:shadow-[inset_0_0_18px_rgba(6,182,212,0.12)] hover:scale-[1.002]`}
                >
                  {/* Product Name */}
                  <td className="py-3 px-5 text-[#111827] font-medium truncate max-w-[220px]">
                    {p.name}
                  </td>

                  {/* Brand (hidden on small screens) */}
                  <td className="py-3 px-5 text-[#374151] hidden md:table-cell">
                    {p.brand || "—"}
                  </td>

                  {/* Featured (hidden on <lg screens) */}
                  <td className="py-3 px-5 hidden lg:table-cell">
                    {p.isFeatured ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <IoMdCheckmark className="w-4 h-4" />
                        بله
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-500 font-medium">
                        <FaTimesCircle className="w-3.5 h-3.5" />
                        خیر
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <button
                        className="p-1.5 rounded-full text-[#06b6d4] hover:bg-[#06b6d4]/10 transition"
                        title="ویرایش"
                      >
                        <FiEdit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        className="p-1.5 rounded-full text-rose-500 hover:bg-rose-500/10 transition"
                        title="حذف"
                      >
                        <FiTrash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Mobile Card View ===== */}
      <div className="md:hidden divide-y divide-[#e5e7eb]/80">
        {products.map((p) => (
          <div
            key={p._id}
            className="p-4 flex flex-col gap-2 bg-gradient-to-r from-white to-[#f9fafb]
                       hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.12)] transition-all"
          >
            {/* Product Name */}
            <div className="font-semibold text-[#111827] truncate">
              {p.name}
            </div>

            {/* Brand + Featured Line */}
            <div className="text-sm text-[#475569] flex items-center justify-between">
              <span>{p.brand || "—"}</span>
              {p.isFeatured ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium text-[13px]">
                  <IoMdCheckmark className="w-3.5 h-3.5" />
                  بله
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-500 font-medium text-[13px]">
                  <FaTimesCircle className="w-3 h-3" />
                  خیر
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-1">
              <button
                className="p-1 rounded-full text-[#06b6d4] hover:bg-[#06b6d4]/10 transition"
                title="ویرایش"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-full text-rose-500 hover:bg-rose-500/10 transition"
                title="حذف"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Footer Gradient Bottom Shadow ===== */}
      <div className="h-3 bg-gradient-to-t from-[#f3f4f6] to-transparent" />
    </div>
  );
}
