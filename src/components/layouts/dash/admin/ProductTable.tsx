import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiBox } from "react-icons/fi";

function ProductTable({ products }: { products: any[] }) {
  return (
    <div className="mt-12 relative z-10 rounded-2xl backdrop-blur-xl bg-white/85 border border-[#e5e7eb]/60 shadow-[0_6px_20px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* هدر بالای جدول */}
      <div className="px-6 py-4 border-b border-[#e5e7eb]/70 bg-linear-to-r from-white to-[#f9fafb] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#111827] font-vazirmatn font-semibold text-base tracking-tight">
          <FiBox className="text-primary w-5 h-5" />
          <span>فهرست محصولات</span>
        </div>
        <span className="text-sm text-[#6b7280] font-medium">
          {products.length} آیتم
        </span>
      </div>

      {/* جدول */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#d1d5db] scrollbar-track-transparent">
        <table className="min-w-full text-sm text-[#374151] border-collapse">
          <thead className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#e5e7eb]">
            <tr>
              <th className="text-right py-3 px-5 font-semibold">نام محصول</th>
              <th className="text-right py-3 px-5 font-semibold">قیمت</th>
              <th className="text-right py-3 px-5 font-semibold">وضعیت</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-10 text-[#9ca3af] font-medium"
                >
                  هیچ محصولی یافت نشد.
                </td>
              </tr>
            ) : (
              products.map((p, i) => (
                <tr
                  key={i}
                  className={`transition-all duration-200 ${
                    i % 2 === 0 ? "bg-white/60" : "bg-transparent"
                  } hover:bg-[#06b6d4]/10 hover:shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]`}
                >
                  <td className="py-3 px-5 whitespace-nowrap font-medium text-[#111827]">
                    {p.name}
                  </td>
                  <td className="py-3 px-5 text-[#1f2937] font-semibold">
                    {Number(p.price || 0).toLocaleString("fa-IR")} تومان
                  </td>
                  <td className="py-3 px-5 font-semibold">
                    {p.status === "موجود" ? (
                      <div className="flex items-center gap-2 text-[#16a34a]">
                        <FaCheckCircle className="w-4 h-4" />
                        <span>موجود</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[#dc2626]">
                        <FaTimesCircle className="w-4 h-4" />
                        <span>ناموجود</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* سایه‌ی تزئینی پایین */}
      <div className="h-3 bg-linear-to-t from-[#f3f4f6] to-transparent" />
    </div>
  );
}

export default ProductTable;
