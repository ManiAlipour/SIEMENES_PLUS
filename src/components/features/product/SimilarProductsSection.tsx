import Link from "next/link";
import ProductCard from "@/components/features/ProductCard";
import { FiArrowLeft } from "react-icons/fi";

type SimilarProductsSectionProps = {
  products: ProductObject[];
  category?: string;
};

export default function SimilarProductsSection({
  products,
  category,
}: SimilarProductsSectionProps) {
  if (!products.length) return null;

  return (
    <section
      className="mt-14 sm:mt-20"
      aria-labelledby="similar-products-heading"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            پیشنهاد ویژه
          </span>
          <h2
            id="similar-products-heading"
            className="text-2xl font-black text-slate-900 sm:text-3xl"
          >
            محصولات مرتبط
          </h2>
          {category && (
            <p className="mt-1 text-sm text-slate-500">
              سایر محصولات در دسته {category}
            </p>
          )}
        </div>
        {category && (
          <Link
            href={`/shop?category=${encodeURIComponent(category)}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-cyan-600"
          >
            مشاهده همه
            <FiArrowLeft className="h-4 w-4" />
          </Link>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.slice(0, 10).map((sp) => (
          <li key={sp._id}>
            <ProductCard
              id={sp._id}
              name={sp.name}
              image={sp.image}
              brand={sp.brand}
              modelNumber={sp.modelNumber}
              category={sp.category}
              slug={sp.slug}
              isFeatured={sp.isFeatured}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
