"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import ProductFilters from "@/components/features/shop/ProductFilters";
import ProductGrid from "@/components/features/shop/ProductGrid";
import Pagination from "@/components/features/shop/Pagination";
import FeaturedProductsSection from "@/components/features/shop/FeaturedProductsSection";
import TopCategoriesSection from "@/components/features/shop/TopCategoriesSection";

type ViewMode = "grid" | "list";

export default function ShopPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Get URL params
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Fetch products
  const { products, loading, error, total, pages, currentPage } = useProducts({
    search,
    category,
    sort,
    page,
    limit: 12,
  });

  // Update URL params
  const updateParams = (
    updates: {
      search?: string;
      category?: string;
      sort?: string;
      page?: number;
    }
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.search !== undefined) {
      if (updates.search) {
        params.set("search", updates.search);
      } else {
        params.delete("search");
      }
    }

    if (updates.category !== undefined) {
      if (updates.category) {
        params.set("category", updates.category);
      } else {
        params.delete("category");
      }
    }

    if (updates.sort !== undefined) {
      params.set("sort", updates.sort);
    }

    if (updates.page !== undefined) {
      if (updates.page > 1) {
        params.set("page", updates.page.toString());
      } else {
        params.delete("page");
      }
    }

    // Reset to page 1 when filters change (except when explicitly setting page)
    if (
      updates.search !== undefined ||
      updates.category !== undefined ||
      updates.sort !== undefined
    ) {
      if (updates.page === undefined) {
        params.delete("page");
      }
    }

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    updateParams({ search: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    updateParams({ category: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "خانه",
          item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir"}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "فروشگاه",
          item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir"}/shop`,
        },
      ],
    };
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div dir="rtl" className="min-h-screen bg-background">
        {/* Featured Products Section */}
        <FeaturedProductsSection />

        {/* Top Categories Section */}
        <TopCategoriesSection />

        {/* Header Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-vazir text-gray-900 mb-4">
                فروشگاه محصولات
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                تجهیزات اتوماسیون صنعتی، PLC، اینورتر، HMI و قطعات زیمنس با
                بهترین قیمت و پشتیبانی فنی
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <ProductFilters
                search={search}
                onSearchChange={handleSearchChange}
                category={category}
                onCategoryChange={handleCategoryChange}
                sort={sort}
                onSortChange={handleSortChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalProducts={total}
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            {error ? (
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  خطا در دریافت محصولات
                </h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  تلاش مجدد
                </button>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={products}
                  viewMode={viewMode}
                  loading={loading}
                />

                {/* Pagination */}
                {!loading && pages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

