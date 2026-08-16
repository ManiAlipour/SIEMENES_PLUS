import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ProductCard from "../features/ProductCard";
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
      className="w-full bg-[#f3f5f7] py-16 md:py-20"
      aria-labelledby="featured-products-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <header className="mb-10 max-w-2xl md:mb-14">
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-primary">
            فروشگاه
          </p>
          <h2
            id="featured-products-heading"
            className="text-2xl font-black leading-tight text-slate-900 md:text-3xl"
          >
            محصولات زیمنس بر اساس دسته‌بندی
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
            جستجو با نام محصول یا کد MLFB در فروشگاه زیمنس پلاس.
          </p>
        </header>

        {categories.length === 0 ? (
          <p className="py-12 text-slate-500">
            محصولی برای نمایش نیست.{" "}
            <Link href="/shop" className="font-semibold text-primary underline">
              مشاهده فروشگاه
            </Link>
          </p>
        ) : (
          <div className="space-y-14 md:space-y-16">
            {categories.map((category) => {
              const shopUrl = getShopCategoryUrl(category);
              const previewCount = Math.min(4, category.products.length);
              const previewProducts = category.products.slice(0, previewCount);

              return (
                <div key={category.id}>
                  <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200/90 pb-4 md:mb-6">
                    <div className="flex min-w-0 items-center gap-3">
                      {category.image ? (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-white">
                          <Image
                            src={category.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : null}
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-slate-900 md:text-xl">
                          {category.title}
                        </h3>
                        <p className="text-xs text-slate-500 md:text-sm">
                          {category.products.length.toLocaleString("fa-IR")}{" "}
                          محصول
                        </p>
                      </div>
                    </div>

                    {shopUrl ? (
                      <Link
                        href={shopUrl}
                        className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5"
                        aria-label={`مشاهده همه محصولات دسته ${category.title}`}
                      >
                        همه
                        <FiArrowLeft className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>

                  <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden">
                    {previewProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex w-[148px] shrink-0 snap-start xs:w-[180px] md:w-[210px] lg:w-[230px]"
                      >
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          image={product.image}
                          slug={product.slug}
                        />
                      </div>
                    ))}
                    {category.products.length > previewCount && shopUrl ? (
                      <Link
                        href={shopUrl}
                        className="flex h-auto min-h-[16rem] w-[120px] shrink-0 snap-start flex-col items-center justify-center border border-dashed border-primary/35 bg-primary/[0.04] text-center text-sm font-bold text-primary transition hover:border-primary hover:bg-primary hover:text-white xs:w-[140px] md:w-[150px]"
                        aria-label={`نمایش همه محصولات دسته ${category.title}`}
                      >
                        <span className="mb-1 text-xs opacity-80">
                          +
                          {(
                            category.products.length - previewCount
                          ).toLocaleString("fa-IR")}
                        </span>
                        مشاهده همه
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
