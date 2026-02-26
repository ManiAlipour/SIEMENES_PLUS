"use client";

import { useEffect, useState, useCallback } from "react";
import { FiX, FiSearch, FiPackage } from "react-icons/fi";

export interface ProductOption {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface BlogProductPickerModalProps {
  onClose: () => void;
  onSelect: (product: ProductOption) => void;
}

export default function BlogProductPickerModal({
  onClose,
  onSelect,
}: BlogProductPickerModalProps) {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  useEffect(() => {
    fetch("/api/products?limit=50")
      .then((res) => res.json())
      .then((data) => {
        const list = data?.items ?? data?.data ?? [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.slug && p.slug.toLowerCase().includes(search.toLowerCase())),
      )
    : products;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="انتخاب محصول برای درج در مطلب"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-slate-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">درج محصول در مطلب</h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="بستن"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition-colors"
              autoFocus
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 min-h-[220px]">
          {loading ? (
            <ul className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </li>
              ))}
            </ul>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <FiPackage size={28} />
              </div>
              <p className="font-medium text-slate-600">محصولی یافت نشد</p>
              <p className="text-sm mt-1">عبارت جستجو را تغییر دهید.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((p) => (
                <li key={p._id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(p);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/60 transition-all text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-cyan-200 active:scale-[0.99]"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                        تصویر
                      </div>
                    )}
                    <span className="font-medium text-slate-800 flex-1 text-right">
                      {p.name}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{p.slug}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
