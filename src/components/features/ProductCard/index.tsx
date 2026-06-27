import Image from "next/image";
import Link from "next/link";
import ProductActions from "./ProductActions";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price?: number;
  inStock?: boolean;
  brand?: string;
  isFeatured?: boolean;
  slug?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  inStock = true,
  brand,
  isFeatured = false,
  slug,
}: ProductCardProps) {
  const productUrl = slug ? `/shop/${slug}` : `/shop/${id}`;

  const formattedPrice =
    typeof price === "number"
      ? new Intl.NumberFormat("fa-IR").format(price)
      : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors hover:border-gray-300">
      {/* 1. لینک سراسری روی کل کارت */}
      <Link
        href={productUrl}
        className="absolute inset-0 z-10"
        aria-label={name}
      />

      {/* بخش تصویر */}
      <div className="relative flex aspect-square items-center justify-center bg-gray-50 p-6">
        {isFeatured && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-medium text-white">
            ویژه
          </span>
        )}

        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4"
        />
      </div>

      {/* بخش محتوا */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 min-h-[56px]">
          {brand && (
            <span className="mb-1 block text-xs text-gray-400">{brand}</span>
          )}
          <h3 className="line-clamp-2 text-sm font-medium leading-6 text-gray-800">
            {name}
          </h3>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">وضعیت</span>
            <span
              className={`text-xs font-medium ${
                inStock ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {inStock ? "موجود" : "ناموجود"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">قیمت</span>
            {formattedPrice ? (
              <span className="text-sm font-bold text-gray-900">
                {formattedPrice}
                <span className="mr-1 text-xs font-medium text-gray-500">
                  تومان
                </span>
              </span>
            ) : (
              <span className="text-sm text-gray-400">تماس بگیرید</span>
            )}
          </div>
        </div>

        {/* 2. دکمه‌ها - حتما باید z-index بالاتر داشته باشند تا لینک زیرین را غیرفعال کنند */}
        <div className="relative z-20 mt-auto border-t border-gray-100 pt-3">
          <ProductActions id={id} inStock={inStock} />
        </div>
      </div>
    </article>
  );
}
