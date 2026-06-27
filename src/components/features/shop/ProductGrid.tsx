"use client";

import ProductCard from "../ProductCard";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiAlertCircle, FiTag } from "react-icons/fi";
import ListLikeButton from "./ListLikeButton";

interface ProductGridProps {
  products: ProductObject[];
  viewMode: "grid" | "list";
  loading?: boolean;
  searchQuery?: string;
}

function highlightMatch(text: string, query: string) {
  if (!query?.trim() || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  if (parts.length <= 1) return text;

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="rounded bg-amber-100 px-0.5 font-semibold text-amber-900"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function ProductGrid({
  products,
  viewMode,
  loading = false,
  searchQuery = "",
}: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={`grid gap-4 md:gap-6 ${
          viewMode === "grid"
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
        <div className="mb-6 rounded-2xl bg-slate-100 p-6">
          <FiAlertCircle className="h-14 w-14 text-slate-400" />
        </div>
        <h3 className="mb-2 text-2xl font-black text-slate-900">
          محصولی پیدا نشد
        </h3>
        <p className="mb-8 max-w-md text-slate-600">
          عبارت جستجو، دسته‌بندی یا مرتب‌سازی را تغییر دهید. برای شماره مدل
          زیمنس می‌توانید با یا بدون خط تیره جستجو کنید.
        </p>
        <Link
          href="/shop"
          className="rounded-xl bg-gradient-to-r from-primary to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-primary/30"
        >
          مشاهده همه محصولات
        </Link>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4 md:space-y-5">
        {products.map((product, idx) => {
          const productUrl = product.slug
            ? `/shop/${product.slug}`
            : `/shop/${product._id}`;

          return (
            <article
              key={product._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary/25 hover:shadow-lg sm:flex-row"
            >
              <Link
                href={productUrl}
                className="relative aspect-square w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 to-cyan-50/30 sm:w-44 md:w-52 lg:w-56"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 224px"
                  className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                  priority={idx < 2}
                />
                {product.isFeatured && (
                  <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-xs font-bold text-white">
                    ویژه
                  </span>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  {product.brand && (
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/80">
                      {product.brand}
                    </span>
                  )}
                  <Link href={productUrl}>
                    <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary md:text-xl">
                      {highlightMatch(product.name, searchQuery)}
                    </h3>
                  </Link>

                  {product.modelNumber && (
                    <p className="mb-3 font-mono text-sm font-medium text-slate-600">
                      MLFB:{" "}
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-800">
                        {highlightMatch(product.modelNumber, searchQuery)}
                      </span>
                    </p>
                  )}

                  {product.description && (
                    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {product.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {product.category && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        <FiTag className="h-3 w-3" />
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <ListLikeButton productId={product._id} />
                  <Link
                    href={productUrl}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
                  >
                    <FiShoppingCart className="h-4 w-4" />
                    مشاهده جزئیات
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <div key={product._id} className="h-full">
          <ProductCard
            id={product._id}
            name={product.name}
            image={product.image}
            brand={product.brand}
            modelNumber={product.modelNumber}
            category={product.category}
            isFeatured={product.isFeatured}
            slug={product.slug}
          />
        </div>
      ))}
    </div>
  );
}
