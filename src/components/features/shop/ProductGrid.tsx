"use client";

import ProductCard from "../ProductCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiAlertCircle } from "react-icons/fi";
import ListLikeButton from "./ListLikeButton";

interface ProductGridProps {
  products: ProductObject[];
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
        className={`grid gap-6 md:gap-8 ${
          viewMode === "grid"
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200" />
            <div className="p-5 space-y-4">
              <div className="h-5 bg-gray-200 rounded-xl w-3/4" />
              <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
              <div className="h-8 bg-gray-200 rounded-xl w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 md:py-32 px-4 animate-fadeIn">
        <div className="flex items-center justify-center mb-8">
          <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl">
            <FiAlertCircle className="w-20 h-20 md:w-24 md:h-24 text-gray-400" />
          </div>
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
          محصولی پیدا نشد
        </h3>
        <p className="text-gray-600 text-lg md:text-xl mb-10 text-center max-w-md leading-relaxed">
          معیار جستجو یا فیلترها را تغییر دهید تا محصولات بیشتری مشاهده کنید.
        </p>
        <button
          type="button"
          className="bg-gradient-to-r from-primary via-cyan-500 to-blue-600 text-white rounded-2xl font-bold px-8 py-4 shadow-2xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200 text-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          بازگشت به بالا
        </button>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-5 md:space-y-6">
        {products.map((product, idx) => {
          const productUrl = product.slug
            ? `/shop/${product.slug}`
            : `/shop/${product._id}`;
          return (
            <div
              key={product._id}
              className="group bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-300 flex flex-col sm:flex-row gap-5 md:gap-8 overflow-hidden animate-fadeIn"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {/* Product Image */}
              <div
                onClick={() => router.push(productUrl)}
                className="relative w-full sm:w-48 md:w-56 lg:w-64 aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-100 cursor-pointer overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary/5 group-hover:via-cyan-50 group-hover:to-blue-50 transition-all duration-500"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 256px, 256px"
                  className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                  draggable={false}
                  priority={idx < 2}
                />
                {product.isFeatured && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-primary to-cyan-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-xl z-10">
                    ⭐ ویژه
                  </span>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between flex-1 py-5 px-5 sm:px-0 min-w-0">
                <div>
                  <h3
                    onClick={() => router.push(productUrl)}
                    className="cursor-pointer font-black text-xl md:text-2xl text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-3 leading-tight"
                  >
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm md:text-base text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    {product.brand && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                        {product.brand}
                      </span>
                    )}
                    {product.category && (
                      <span className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                  <div className="flex items-center gap-3">
                    <ListLikeButton productId={product._id} />
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 min-h-[44px] bg-gradient-to-r from-primary to-cyan-500 text-white rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-transform duration-200 text-xs sm:text-sm md:text-base touch-manipulation"
                    onClick={() => router.push(productUrl)}
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    مشاهده جزئیات
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
      {products.map((product) => (
        <div key={product._id} className="h-full animate-fadeIn">
          <ProductCard
            id={product._id}
            name={product.name}
            image={product.image}
            brand={product.brand}
            isFeatured={product.isFeatured}
            slug={product.slug}
            className="h-full rounded-3xl shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-primary/30 bg-white transition-all duration-300"
          />
        </div>
      ))}
    </div>
  );
}
