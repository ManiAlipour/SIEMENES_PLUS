// app/(store)/shop/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import ProductGrid from "@/components/layouts/shop/ProductGrid";
import SidebarFilters from "@/components/layouts/shop/SidebarFilters";
import SearchBar from "@/components/layouts/shop/SearchBar";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const metadata: Metadata = {
  title: "فروشگاه محصولات | برند کنترل‌روم",
  description:
    "نمایش مجموعه محصولات رسمی برند کنترل‌روم با فیلتر برند و دسته‌بندی و قابلیت جست‌وجو.",
  openGraph: {
    title: "فروشگاه کنترل‌روم",
    description: "مرور محصولات برند کنترل‌روم.",
    url: "https://YOUR_DOMAIN/shop",
    type: "website",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    page?: string;
  };
}) {
  await connectDB();

  const { q, category, brand, page } = searchParams;
  const limit = 12;
  const skip = page ? (parseInt(page) - 1) * limit : 0;

  const filter: any = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (category) filter.category = category;
  if (brand) filter.brand = brand;

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <section className="container mx-auto px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1">
        <Suspense fallback={<div>در حال بارگذاری فیلترها...</div>}>
          <SidebarFilters
            selectedCategory={category || ""}
            selectedBrand={brand || ""}
          />
        </Suspense>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {q
              ? `نتایج جست‌وجوی "${q}"`
              : category
              ? `دسته‌بندی: ${category}`
              : "تمام محصولات"}
          </h1>

          {/* ✅ SearchBar داخل Suspense */}
          <Suspense fallback={<div>...</div>}>
            <SearchBar initialQuery={q || ""} />
          </Suspense>
        </div>

        <ProductGrid products={JSON.parse(JSON.stringify(products))} />

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <a
              key={i}
              href={`?${new URLSearchParams({
                ...searchParams,
                page: String(i + 1),
              }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center rounded-md text-sm border ${
                page == String(i + 1)
                  ? "bg-teal-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
