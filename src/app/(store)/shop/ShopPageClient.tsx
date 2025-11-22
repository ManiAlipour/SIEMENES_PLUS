"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useProducts } from "@/hooks/useProducts";
import LoadingFallback from "./LoadingFallback";
import Pagination from "@/components/features/shop/Pagination";
import ProductGrid from "@/components/features/shop/ProductGrid";

const FeaturedProductsSection = dynamic(
  () => import("@/components/features/shop/FeaturedProductsSection"),
  { ssr: false, loading: () => <LoadingFallback /> }
);
const TopCategoriesSection = dynamic(
  () => import("@/components/features/shop/TopCategoriesSection"),
  { ssr: false }
);
const ProductFilters = dynamic(
  () => import("@/components/features/shop/ProductFilters"),
  { ssr: false }
);

type ViewMode = "grid" | "list";

export default function ShopPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- State ---
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // --- URL params ---
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // --- Fetch Products ---
  const { products, loading, error, total, currentPage, pages } = useProducts({
    search,
    category,
    sort,
    page,
    limit: 12,
  });

  // --- URL sync helper ---
  const updateParams = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== "") params.set(k, v.toString());
      else params.delete(k);
    });
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  // --- SEO Schemas ---
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
    []
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
    [products]
  );

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />

      <main
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-gray-800"
      >
        {/* Section: Featured Products */}
        <section className="py-12 md:py-16 border-b border-slate-200/50">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <Suspense fallback={<LoadingFallback />}>
              <FeaturedProductsSection />
            </Suspense>
          </div>
        </section>

        {/* Section: Categories */}
        <section className="py-12 md:py-16 border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <TopCategoriesSection />
          </div>
        </section>

        {/* Section: Hero & Filters */}
        <section className="py-12 md:py-16 border-b border-slate-200/50">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 text-center">
            <h1 className="font-vazirmatn text-3xl md:text-4xl font-bold tracking-tight mb-3">
              خرید محصولات زیمنس – Siemens Industrial
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              مجموعه کامل PLC، HMI، درایو و تجهیزات اتوماسیون با پشتیبانی فنی
              مهندسی
            </p>

            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/50 shadow-lg rounded-2xl p-4 md:p-6">
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
              />
            </div>
          </div>
        </section>

        {/* Section: Product Grid */}
        <section className="py-12 md:py-16">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            {error && (
              <div className="text-center text-red-600 py-14">{error}</div>
            )}
            <ProductGrid
              products={products}
              viewMode={viewMode}
              loading={loading}
            />

            {!loading && pages > 1 && (
              <div className="pt-10">
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
