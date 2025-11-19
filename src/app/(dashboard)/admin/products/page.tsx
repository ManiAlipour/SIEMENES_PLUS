"use client";

import { useState, useEffect } from "react";
import TitleBar from "@/components/ui/dash/TitleBar";
import { CiShoppingCart } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { BsBoxSeam, BsGraphUp } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import AddProductModal from "@/components/layouts/dash/admin/addProductModal";
import toast from "react-hot-toast";
import ProductTable from "@/components/layouts/dash/admin/ProductTable";

/* -----------------------
   Main Products Page
------------------------ */
export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/products?limit=15`
        );
        const { items } = await res.json();
        setProducts(items);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Loading state skeleton
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#06b6d4] font-vazirmatn">
        در حال بارگذاری محصولات...
      </div>
    );
  }

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(query.toLowerCase().trim())
  );

  const addProductHandler = () => {
    setAddProductModalOpen(false);
    toast.success("محصول با موفقیت افزوده شد!");
  };

  return (
    <div
      dir="rtl"
      className="relative z-0 min-h-screen font-vazirmatn bg-gradient-to-br from-white to-[#f1f5f9] px-4 md:px-8 py-6"
    >
      {/* ===== Title Bar ===== */}
      <TitleBar
        Icon={CiShoppingCart}
        title="مدیریت محصولات"
        address={["داشبورد", "محصولات"]}
      />

      {/* ===== Top Bar ===== */}
      <div
        className="mt-8 relative z-10 flex flex-wrap md:flex-nowrap items-center justify-between gap-4
                      bg-white/70 backdrop-blur-xl border border-[#e5e7eb]/70 rounded-2xl px-4 py-3
                      shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_4px_25px_rgba(6,182,212,0.18)]"
      >
        {/* Search Field */}
        <div
          className="grow flex items-center gap-2 bg-white/60 backdrop-blur-md border border-[#e5e7eb]/60 
                        rounded-xl px-3 py-2 focus-within:border-[#06b6d4]/70 transition-colors duration-200"
        >
          <FiSearch size={20} className="text-[#6b7280]" />
          <input
            type="text"
            placeholder="جستجوی محصول..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent w-full outline-none text-sm text-[#111827] placeholder-[#9ca3af]"
          />
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setAddProductModalOpen(true)}
          className="flex items-center gap-2 justify-center w-full md:w-auto px-4 py-2
                     bg-gradient-to-r from-[#06b6d4] to-[#0e7490] text-white rounded-xl
                     text-sm font-medium hover:scale-[1.02] active:scale-[0.98]
                     transition duration-300 shadow-[0_6px_18px_rgba(6,182,212,0.25)]"
        >
          <MdAddCircleOutline size={20} />
          افزودن محصول جدید
        </button>
      </div>

      {/* Add Product Modal */}
      {addProductModalOpen && (
        <AddProductModal
          onAdd={addProductHandler}
          onClose={() => setAddProductModalOpen(false)}
        />
      )}

      {/* ===== Info Cards ===== */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <InfoCard
          label="تعداد کل محصولات"
          value={products.length.toString()}
          icon={<BsBoxSeam size={24} />}
          color="from-[#06b6d4] to-[#0e7490]"
        />
        <InfoCard
          label="محصولات فعال"
          value={products
            .filter((p: any) => p.status === "موجود")
            .length.toString()}
          icon={<BsGraphUp size={24} />}
          color="from-[#16a34a] to-[#065f46]"
        />
        <InfoCard
          label="محصولات ناموجود"
          value={products
            .filter((p: any) => p.status === "ناموجود")
            .length.toString()}
          icon={<BsBoxSeam size={24} />}
          color="from-[#f59e0b] to-[#b45309]"
        />
      </div>

      {/* ===== Product Table ===== */}
      <ProductTable products={filtered} />
    </div>
  );
}

/* ------------------
   InfoCard Component
------------------- */
function InfoCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl backdrop-blur-xl bg-white/80 border border-[#e5e7eb]/60 
                  shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4 
                  hover:shadow-[0_4px_25px_rgba(6,182,212,0.18)] hover:scale-[1.015]
                  transition-all duration-300`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${color} 
                    text-white shadow-[inset_0_0_8px_rgba(255,255,255,0.3)]`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-[#6b7280] font-medium">{label}</span>
        <span className="text-2xl font-bold text-[#1f2937] tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
}
