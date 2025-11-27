"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useProducts } from "@/hooks/useProducts";
import LoadingFallback from "./LoadingFallback";
import Pagination from "@/components/features/shop/Pagination";
import ProductGrid from "@/components/features/shop/ProductGrid";
import Divider from "@/components/ui/Divider";
import { FiSearch, FiArrowDownCircle, FiShoppingBag } from "react-icons/fi";
import { FaBoxesStacked } from "react-icons/fa6";
import { motion } from "framer-motion";

const FeaturedProductsSection = dynamic(
  () => import("@/components/features/shop/FeaturedProductsSection"),
  { ssr: false, loading: () => <LoadingFallback /> }
);
const TopCategoriesSection = dynamic(
  () => import("@/components/features/shop/TopCategoriesSection"),
  { ssr: false }
);
const SuggestedCategoriesSection = dynamic(
  () => import("@/components/features/shop/SuggestedCategoriesSection"),
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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

  const updateParams = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== "") params.set(k, v.toString());
      else params.delete(k);
    });
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <main
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-white via-slate-50/80 to-slate-100 text-gray-800"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #f8fafc 70%, #dbf4ff 100%, #e6f7f6 120%)",
        }}
      >
        {/* Hero & Filters */}
        <section className="pt-10 pb-8 md:py-16">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="rounded-3xl shadow-xl bg-primary/10 mx-auto md:px-16 py-12 px-4 mb-7 border-t-4 border-b-8 border-primary/30"
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center bg-primary/40 text-white rounded-2xl w-16 h-16 mb-6"
              >
                <FiShoppingBag className="w-9 h-9" />
              </motion.div>
              <h1 className="font-vazirmatn text-[2.2rem] leading-tight md:text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-l from-blue-600 via-primary to-cyan-500 bg-clip-text text-transparent drop-shadow">
                فروشگاه تخصصی محصولات زیمنس
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg md:text-xl font-[400]">
                کامل‌ترین مرجع فروش تجهیزات اتوماسیون صنعتی،{" "}
                <span className="font-bold text-primary">ارسال</span> فوری و
                مشاوره رایگان فنی
              </p>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16 }}
                className="max-w-3xl sm:mx-auto"
              >
                <div className="bg-white/90 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-[0_6px_28px_rgba(6,182,212,0.12)] flex flex-col md:flex-row md:items-center gap-4 justify-center">
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
                  />
                  <span className="hidden md:inline-flex items-center gap-2 text-primary bg-primary/10 rounded-xl py-2 px-3 text-lg font-semibold ml-2">
                    <FaBoxesStacked className="w-5 h-5" />{" "}
                    <span>{total > 0 ? total.toLocaleString() : "---"}</span>
                    <span>محصول</span>
                  </span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.35, type: "spring" }}
                className="flex justify-center mt-8 md:mt-12"
              >
                <a
                  href="#shop-products-list"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-l from-primary to-blue-600 hover:to-primary/90 text-white shadow-lg font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  <span>رفتن به محصولات</span>
                  <FiArrowDownCircle className="w-5 h-5" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Divider />

        {/* Featured */}
        <section className="pb-12 pt-3 md:pt-8 md:pb-16">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <FeaturedProductsSection />
              </Suspense>
            </motion.div>
          </div>
        </section>
        <Divider />

        {/* Categories */}
        <section className="py-14 md:py-18 bg-gradient-to-l from-white via-[#eefaff] to-slate-100">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <TopCategoriesSection />
            </motion.div>
          </div>
        </section>

        <Divider />

        {/* Suggested Categories */}
        <section className="py-14 md:py-18">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <SuggestedCategoriesSection />
              </Suspense>
            </motion.div>
          </div>
        </section>

        <Divider />

        {/* Product Grid */}
        <section id="shop-products-list" className="py-14 md:py-20">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-primary-700 font-vazirmatn text-2xl md:text-3xl font-extrabold mb-0">
                  <FaBoxesStacked className="w-7 h-7 text-primary" />
                  <span>
                    مشاهده {total > 0 ? total.toLocaleString() + " " : ""}
                    محصول
                  </span>
                </div>
                {!loading && (
                  <span className="text-gray-500 text-sm">
                    صفحه
                    <strong className="mx-1 text-primary">{currentPage}</strong>
                    از
                    <strong className="mx-1 text-primary">{pages}</strong>
                  </span>
                )}
              </div>
              {error && (
                <div className="text-center text-red-600 py-14">{error}</div>
              )}

              <ProductGrid
                products={products}
                viewMode={viewMode}
                loading={loading}
              />

              {!loading && pages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 13 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="pt-10 flex justify-center"
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pages}
                    onPageChange={(p) => updateParams({ page: p })}
                  />
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
