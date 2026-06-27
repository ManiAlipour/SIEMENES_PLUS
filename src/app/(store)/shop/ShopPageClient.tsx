"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Pagination from "@/components/features/shop/Pagination";
import ProductGrid from "@/components/features/shop/ProductGrid";
import { FiShoppingBag, FiLayers, FiSearch } from "react-icons/fi";
import { useLocalStorage } from "iso-hooks";

const TopCategoriesSection = dynamic(
  () => import("@/components/features/shop/TopCategoriesSection"),
  { loading: () => null },
);
const ProductFilters = dynamic(
  () => import("@/components/features/shop/ProductFilters"),
);

type ViewMode = "grid" | "list";

type ShopPageClientProps = {
  products: ProductObject[];
  total: number;
  pages: number;
  currentPage: number;
  search: string;
  category: string;
  sort: string;
};

export default function ShopPageClient({
  products,
  total,
  pages,
  currentPage,
  search,
  category,
  sort,
}: ShopPageClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "shop:view-mode",
    "grid",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const didCategoryRedirect = useRef(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [products, search, category, sort, currentPage]);

  useEffect(() => {
    if (
      category &&
      products.length === 0 &&
      !search &&
      typeof window !== "undefined" &&
      !didCategoryRedirect.current
    ) {
      didCategoryRedirect.current = true;
      const params = new URLSearchParams(window.location.search);
      params.delete("category");
      router.replace(`/shop?${params.toString()}`, { scroll: false });
    }
    if (!category) {
      didCategoryRedirect.current = false;
    }
  }, [category, search, products.length, router]);

  const updateParams = useCallback(
    (updates: Record<string, string | number>) => {
      setIsNavigating(true);
      const params = new URLSearchParams(window.location.search);
      Object.entries(updates).forEach(([k, v]) => {
        if (v && v !== "") params.set(k, v.toString());
        else params.delete(k);
      });
      router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  const breadcrumbJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "خانه",
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "فروشگاه",
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
        },
      ],
    }),
    [],
  );

  const loading = isNavigating;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80"
      >
        <section className="relative overflow-hidden border-b border-slate-200/60 bg-white pb-8 pt-6 md:pb-12 md:pt-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-8 text-center md:mb-10">
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-cyan-500 to-blue-600 shadow-lg shadow-primary/25 md:h-20 md:w-20">
                <FiShoppingBag className="h-8 w-8 text-white md:h-10 md:w-10" />
              </div>

              <h1 className="mb-3 text-3xl font-black leading-tight text-slate-900 md:text-5xl">
                فروشگاه تخصصی
                <span className="mt-1 block bg-gradient-to-l from-primary to-cyan-600 bg-clip-text text-transparent">
                  محصولات زیمنس
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                جستجو با{" "}
                <strong className="font-semibold text-slate-800">نام</strong>،{" "}
                <strong className="font-semibold text-slate-800">برند</strong>{" "}
                یا{" "}
                <strong className="font-semibold text-primary">
                  شماره مدل (MLFB)
                </strong>
                — ارسال فوری و مشاوره فنی رایگان
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <ProductFilters
                search={search}
                onSearchChange={(v) => updateParams({ search: v, page: 1 })}
                category={category}
                onCategoryChange={(v) =>
                  updateParams({ category: v, page: 1 })
                }
                sort={sort}
                onSortChange={(v) => updateParams({ sort: v, page: 1 })}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalProducts={total}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
              />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50/50 py-8 md:py-10">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <TopCategoriesSection />
          </div>
        </section>

        <section
          id="shop-products-list"
          className="py-12 md:py-16"
        >
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-br from-primary to-cyan-500 p-3 shadow-md shadow-primary/20">
                  <FiLayers className="h-6 w-6 text-white md:h-7 md:w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                    {search ? "نتایج جستجو" : "همه محصولات"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 md:text-base">
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        در حال بارگذاری...
                      </span>
                    ) : total > 0 ? (
                      <>
                        <span className="font-bold text-primary">
                          {total.toLocaleString("fa-IR")}
                        </span>{" "}
                        محصول
                        {search && (
                          <>
                            {" "}
                            برای «
                            <span className="font-semibold text-slate-800">
                              {search}
                            </span>
                            »
                          </>
                        )}
                      </>
                    ) : category && !search ? (
                      <>
                        هیچ محصولی در این دسته یافت نشد.{" "}
                        <button
                          type="button"
                          className="font-bold text-primary underline"
                          onClick={() => updateParams({ category: "" })}
                        >
                          مشاهده همه
                        </button>
                      </>
                    ) : search ? (
                      <>
                        محصولی با این عبارت یافت نشد. شماره مدل را بدون فاصله
                        هم امتحان کنید.
                      </>
                    ) : (
                      "محصولی یافت نشد"
                    )}
                  </p>
                </div>
              </div>

              {!loading && pages > 1 && (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm">
                  <span className="text-slate-500">صفحه</span>
                  <span className="text-lg font-black text-primary">
                    {currentPage.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="font-bold text-slate-700">
                    {pages.toLocaleString("fa-IR")}
                  </span>
                </div>
              )}
            </div>

            {search && !loading && products.length > 0 && (
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-cyan-200/60 bg-cyan-50/50 px-4 py-3 text-sm text-cyan-900">
                <FiSearch className="h-4 w-4 shrink-0 text-cyan-600" />
                جستجو در نام، برند، توضیحات، دسته‌بندی و{" "}
                <strong>شماره مدل</strong> انجام شد.
              </div>
            )}

            <ProductGrid
              products={products}
              viewMode={viewMode}
              loading={loading}
              searchQuery={search}
            />

            {!loading && pages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pages}
                  onPageChange={(p) => updateParams({ page: p })}
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
