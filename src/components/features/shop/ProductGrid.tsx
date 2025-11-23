"use client";

import ProductCard from "../ProductCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  loading?: boolean;
}

export default function ProductGrid({
  products,
  viewMode,
  loading = false,
}: ProductGridProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 animate-pulse"
          >
            <div className="aspect-square bg-gray-200 rounded-t-xl" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-24 h-24 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          محصولی یافت نشد
        </h3>
        <p className="text-gray-500">لطفاً فیلترهای جستجو را تغییر دهید</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => {
          const productUrl = product.slug
            ? `/products/${product.slug}`
            : `/products/${product._id}`;

          return (
            <div
              key={product._id}
              className="group bg-white rounded-2xl border border-slate-200/50 shadow-sm 
                         hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-[0.42,0,0.58,1]
                         flex gap-4 overflow-hidden"
            >
              {/* Image Section */}
              <div
                onClick={() => router.push(productUrl)}
                className="relative w-32 sm:w-40 aspect-[4/3] bg-slate-50 cursor-pointer 
                           overflow-hidden flex-shrink-0"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-[0.42,0,0.58,1]"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-between flex-1 p-4">
                <div>
                  <h3
                    onClick={() => router.push(productUrl)}
                    className="cursor-pointer font-semibold text-base text-gray-900 line-clamp-2
                               hover:text-primary transition-colors duration-300"
                  >
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  )}
                  {product.brand && (
                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-2">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => {
                      // TODO: اتصال به سیستم سبد خرید
                    }}
                    className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg 
                               hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                  >
                    <FiShoppingCart className="w-3.5 h-3.5" /> افزودن
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Grid Mode
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          id={product._id}
          name={product.name}
          image={product.image}
          brand={product.brand}
          isFeatured={product.isFeatured}
          slug={product.slug}
          className="h-full"
        />
      ))}
    </div>
  );
}
