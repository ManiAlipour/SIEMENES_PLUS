import Image from "next/image";
import ProductCard from "../features/ProductCard";
import Link from "next/link";
import { FiArrowLeft, FiTrendingUp } from "react-icons/fi";
import type { HighlightedCategory } from "@/lib/categories/highlights";

function getShopCategoryUrl(category: HighlightedCategory) {
  if (category.products.length > 0 && category.slug) {
    return `/shop?category=${category.slug}`;
  }
  return undefined;
}

type Props = {
  categories: HighlightedCategory[];
};

export default function CategoryHighlightsSection({ categories }: Props) {
  return (
    <section
      className="pt-16 md:pt-20 pb-12 md:pb-16 w-full bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30"
      aria-labelledby="featured-products-heading"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-8 xs:mb-12 md:mb-16 px-2">
          <div className="inline-flex items-center gap-2 mb-3 xs:mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FiTrendingUp className="w-5 h-5 xs:w-6 xs:h-6 text-primary" />
            </div>
            <h2
              id="featured-products-heading"
              className="text-2xl xs:text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
            >
              محصولات زیمنس بر اساس دسته‌بندی
            </h2>
          </div>
          <div className="text-sm xs:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            جستجو و خرید محصولات زیمنس با نام محصولات یا کد محصولات (MLFB) در
            <h1 className="inline">فروشگاه زیمنس پلاس</h1>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 max-w-md mx-auto">
              در حال حاضر محصولی برای نمایش وجود ندارد.{" "}
              <Link
                href="/shop"
                className="text-primary font-semibold underline"
              >
                مشاهده فروشگاه <b>زیمنس</b>
              </Link>
            </p>
          </div>
        ) : (
          categories.map((category) => {
            const shopUrl = getShopCategoryUrl(category);
            const previewCount =
              category.products.length > 4 ? 4 : category.products.length;
            const previewProducts = category.products.slice(0, previewCount);

            return (
              <div key={category.id} className="mb-16 md:mb-20 last:mb-0">
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 md:mb-8 gap-3 xs:gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {category.image && (
                      <div className="relative w-14 h-14 xs:w-16 xs:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-lg xs:text-xl md:text-2xl font-bold text-gray-900 mb-1 xs:mb-2 truncate">
                        {category.title}
                      </h3>
                      <p className="text-xs xs:text-sm text-gray-600 whitespace-nowrap">
                        {category.products.length} محصول زیمنس در این دسته
                      </p>
                    </div>
                  </div>

                  {shopUrl ? (
                    <Link
                      href={shopUrl}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary hover:to-primary text-primary hover:text-white px-4 xs:px-5 py-2 xs:py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-primary/20 hover:border-primary text-sm xs:text-base whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`مشاهده همه محصولات زیمنس در دسته ${category.title}`}
                    >
                      <span>مشاهده همه</span>
                      <FiArrowLeft className="w-3 h-3 xs:w-4 xs:h-4" />
                    </Link>
                  ) : null}
                </div>

                <div className="relative">
                  <div className="flex gap-3 md:gap-4 items-stretch flex-nowrap overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth pb-4 px-1 -mx-1 [&>*]:flex-shrink-0">
                    {previewProducts.map((product) => (
                      <div
                        key={product.id}
                        className="max-w-[150px] xs:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] snap-start shrink-0 flex"
                      >
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          image={product.image}
                          slug={product.slug}
                        />
                      </div>
                    ))}
                    {category.products.length > previewCount && shopUrl && (
                      <Link
                        href={shopUrl}
                        className="flex flex-col items-center justify-center min-w-[120px] xs:min-w-[150px] md:min-w-[160px] h-80 bg-primary/10 text-primary rounded-2xl font-bold text-base xs:text-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105 shadow group mx-1 snap-start shrink-0"
                        aria-label={`نمایش همه محصولات دسته ${category.title}`}
                      >
                        <span className="mb-2 text-sm xs:text-base">
                          +{category.products.length - previewCount} محصول بیشتر
                        </span>
                        <div className="flex items-center gap-2">
                          <span>مشاهده همه</span>
                          <FiArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
