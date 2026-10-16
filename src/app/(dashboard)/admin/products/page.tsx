"use client";

import { useState, useEffect, useCallback } from "react";
import TitleBar from "@/components/ui/dash/TitleBar";
import { CiShoppingCart } from "react-icons/ci";
import { FiSearch, FiPackage } from "react-icons/fi";
import { MdAddCircleOutline } from "react-icons/md";
import AddProductModal from "@/components/layouts/dash/admin/addProductModal";
import toast from "react-hot-toast";
import ProductTable from "@/components/layouts/dash/admin/ProductTable";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [pagination, setPagination] = useState<{
    limit: number;
    page: number;
    totalPage: number;
  }>({
    limit: 15,
    page: 1,
    totalPage: 1,
  });

  const fetchProducts = useCallback(async (page = pagination.page, searchTerm = query) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: String(pagination.limit), page: String(page), search: searchTerm.trim() });
      const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("دریافت فهرست محصولات انجام نشد.");
      const { items, page: responsePage, total, pages: totalPage } = await res.json();
      setProducts(items ?? []);
      setPagination((prev) => ({ ...prev, page: responsePage, totalPage }));
      setTotalProduct(total ?? 0);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در دریافت محصولات");
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, pagination.page, query]);

  const changePageHandler = (page: number) => setPagination((prev) => ({ ...prev, page }));

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchProducts(pagination.page, query); }, query ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [fetchProducts, pagination.page, query]);

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#004c97]">
        در حال بارگذاری محصولات...
      </div>
    );
  }

  const addProductHandler = () => {
    setAddProductModalOpen(false);
    toast.success("محصول با موفقیت افزوده شد!");
    fetchProducts();
  };

  return (
    <div dir="rtl" className="mx-auto max-w-7xl">
      <TitleBar
        Icon={CiShoppingCart}
        title="مدیریت محصولات"
        address={["داشبورد", "محصولات"]}
        description="افزودن، ویرایش و مدیریت کاتالوگ محصولات"
      />

      <div className="admin-card mb-5 flex flex-wrap items-center justify-between gap-3 p-3 md:flex-nowrap">
        <div className="flex grow items-center gap-2 rounded-xl border border-[#e8eef5] bg-[#f8fafc] px-3 py-2 focus-within:border-[#0079c2]/50">
          <FiSearch size={18} className="text-[#94a3b8]" />
          <input
            type="text"
            placeholder="جستجوی محصول..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPagination((prev) => ({ ...prev, page: 1 })); }}
            className="w-full bg-transparent text-sm text-[#0b1f33] outline-none placeholder:text-[#94a3b8]"
          />
        </div>

        <button
          type="button"
          onClick={() => setAddProductModalOpen(true)}
          className="admin-btn w-full md:w-auto"
        >
          <MdAddCircleOutline size={18} />
          افزودن محصول
        </button>
      </div>

      {addProductModalOpen && (
        <AddProductModal
          onAdd={addProductHandler}
          onClose={() => setAddProductModalOpen(false)}
        />
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="admin-card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#004c97] to-[#0079c2] text-white">
            <FiPackage size={22} />
          </div>
          <div>
            <p className="text-sm text-[#64748b]">تعداد کل محصولات</p>
            <p className="text-2xl font-bold text-[#0b1f33]">
              {totalProduct.toLocaleString("fa-IR")}
            </p>
          </div>
        </div>
      </div>

      <ProductTable
        products={products}
        onRefresh={fetchProducts}
        pagination={pagination}
        onPageChange={changePageHandler}
      />
    </div>
  );
}
