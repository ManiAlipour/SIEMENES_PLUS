"use client";

import ProductCard from "../ProductCard";
import Link from "next/link";
import Image from "next/image";

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
        <p className="text-gray-500">
          لطفاً فیلترهای جستجو را تغییر دهید
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug || product._id}`}
            className="block"
          >
            <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow flex gap-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 96px, 128px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {product.description}
                  </p>
                )}
                {product.brand && (
                  <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.brand}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/products/${product.slug || product._id}`}
          className="block"
        >
          <ProductCard
            id={product._id}
            name={product.name}
            image={product.image}
            brand={product.brand}
            isFeatured={product.isFeatured}
            slug={product.slug}
            className="h-full"
          />
        </Link>
      ))}
    </div>
  );
}

