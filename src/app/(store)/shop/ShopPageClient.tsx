"use client";

import { Suspense, useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useProducts } from "@/hooks/useProducts";
import LoadingFallback from "./LoadingFallback";
import Pagination from "@/components/features/shop/Pagination";
import ProductGrid from "@/components/features/shop/ProductGrid";
import { FiShoppingBag, FiLayers } from "react-icons/fi";
import CategoryHighlightsSection from "@/components/layouts/CategoryHighlightsSection";
import { useLocalStorage } from "iso-hooks";

const FeaturedProductsSection = dynamic(
  () => import("@/components/features/shop/FeaturedProductsSection"),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const TopCategoriesSection = dynamic(
  () => import("@/components/features/shop/TopCategoriesSection"),
  { ssr: false },
);
const ProductFilters = dynamic(
  () => import("@/components/features/shop/ProductFilters"),
  { ssr: false },
);

type ViewMode = "grid" | "list";

export default function ShopPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "shop:view-mode",
    "grid",
  );
  const [showFilters, setShowFilters] = useState(false);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { products, loading, error, total, currentPage, pages } = useProducts({
    search,
    category,
    sort,
    page,
    limit: 12,
  });

  // Avoid updating router in render: do it in useEffect
  const didCategoryRedirect = useRef(false);
  useEffect(() => {
    if (
      !loading &&
      category &&
      (!products || products.length === 0) &&
      !search &&
      !error &&
      typeof window !== "undefined" &&
      !didCategoryRedirect.current
    ) {
      didCategoryRedirect.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category");
      router.replace(`/shop?${params.toString()}`, { scroll: false });
    }
    if (!category) {
      didCategoryRedirect.current = false;
    }
  }, [loading, category, search, error, products, searchParams, router]);

  const updateParams = useCallback(
    (updates: Record<string, any>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v && v !== "") params.set(k, v.toString());
        else params.delete(k);
      });
      router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
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

  const collectionJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "فروشگاه محصولات زیمنس | تجهیزات اتوماسیون صنعتی",
      description:
        "لیست کامل PLC، HMI، درایو و تجهیزات اتوماسیون صنعتی زیمنس با قیمت روز و ارسال فوری.",
      mainEntity: products?.map((p) => ({
        "@type": "Product",
        name: p.name,
        brand: p.brand,
        image: p.image,
        offers: {
          "@type": "Offer",
          priceCurrency: "IRR",
          availability: "https://schema.org/InStock",
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${p.slug}`,
      })),
    }),
    [products],
  );

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <main
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
      >
        {/* Hero Section */}
        <section className="relative pt-6 pb-8 md:pt-12 md:pb-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 via-cyan-400/15 to-blue-500/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300/15 via-cyan-300/15 to-transparent rounded-full blur-2xl" />
          </div>

          <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-8 md:mb-12 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 mb-6 rounded-3xl bg-gradient-to-br from-primary via-cyan-500 to-blue-600 shadow-2xl shadow-primary/40">
                <FiShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-l from-gray-900 via-primary to-cyan-600 bg-clip-text text-transparent">
                  فروشگاه تخصصی
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  محصولات زیمنس
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
                کامل‌ترین مرجع فروش تجهیزات اتوماسیون صنعتی
                <br />
                <span className="text-primary font-bold">ارسال فوری</span> و{" "}
                <span className="text-cyan-600 font-bold">مشاوره رایگان فنی</span>
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-6">
              <ProductFilters
                search={search}
                onSearchChange={(v) => updateParams({ search: v, page: 1 })}
                category={category}
                onCategoryChange={(v) => updateParams({ category: v, page: 1 })}
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

        <section className="py-12 md:py-16 bg-white/80" style={{ contentVisibility: "auto" }}>
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <Suspense fallback={<LoadingFallback />}>
              <FeaturedProductsSection />
            </Suspense>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gradient-to-br from-slate-50 via-white to-cyan-50/40" style={{ contentVisibility: "auto" }}>
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <TopCategoriesSection />
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white" style={{ contentVisibility: "auto" }}>
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <Suspense fallback={<LoadingFallback />}>
              <CategoryHighlightsSection />
            </Suspense>
          </div>
        </section>

        {/* Main Products Section */}
        <section
          id="shop-products-list"
          className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white"
          style={{ contentVisibility: "auto" }}
        >
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 md:mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary via-cyan-500 to-blue-600 rounded-2xl shadow-xl shadow-primary/30">
                    <FiLayers className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                      همه محصولات
                    </h2>
                    <p className="text-base md:text-lg text-gray-600">
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          در حال بارگذاری...
                        </span>
                      ) : total > 0 ? (
                        <>
                          <span className="font-black text-primary text-xl">
                            {total.toLocaleString("fa-IR")}
                          </span>{" "}
                          محصول موجود
                        </>
                      ) : category && !search && !error ? (
                        // Empty category: show user-friendly message and link to all products
                        <span>
                          هیچ محصولی در این دسته یافت نشد.
                          <br />
                          <button
                            className="underline text-primary font-bold mt-2"
                            onClick={() => updateParams({ category: "" })}
                            type="button"
                          >
                            مشاهده همه محصولات
                          </button>
                        </span>
                      ) : (
                        "محصولی یافت نشد"
                      )}
                    </p>
                  </div>
                </div>
                {!loading && pages > 1 && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
                    <span className="text-sm font-semibold text-gray-600">
                      صفحه
                    </span>
                    <span className="font-black text-primary text-2xl">
                      {currentPage}
                    </span>
                    <span className="text-sm font-semibold text-gray-600">
                      از
                    </span>
                    <span className="font-black text-gray-900 text-xl">
                      {pages}
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-8 md:p-12 text-center shadow-lg">
                  <p className="text-red-600 font-bold text-lg md:text-xl">
                    {error}
                  </p>
                </div>
              )}

              {/* Products Grid */}
              <ProductGrid
                products={products}
                viewMode={viewMode}
                loading={loading}
              />

              {!loading && pages > 1 && (
                <div className="pt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pages}
                    onPageChange={(p) => updateParams({ page: p })}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
