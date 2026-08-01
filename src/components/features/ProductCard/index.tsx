import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiTag } from "react-icons/fi";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  brand?: string;
  modelNumber?: string;
  category?: string;
  isFeatured?: boolean;
  slug?: string;
}

export default function ProductCard({
  id,
  name,
  image,
  brand,
  modelNumber,
  category,
  isFeatured = false,
  slug,
}: ProductCardProps) {
  const productUrl = slug ? `/shop/${slug}` : `/shop/${id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 md:hover:-translate-y-1 will-change-transform">
      <Link
        href={productUrl}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={name}
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 p-4 sm:p-5">
        {isFeatured && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md sm:text-xs">
            ویژه
          </span>
        )}

        {modelNumber && (
          <span className="absolute bottom-3 right-3 z-20 max-w-[85%] truncate rounded-lg bg-slate-900/90 px-2 py-1 font-mono text-[10px] font-medium tracking-wide text-cyan-100 sm:text-xs">
            {modelNumber}
          </span>
        )}

        <Image
          src={image}
          alt={name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 transition-transform duration-500 md:group-hover:scale-105"
          priority={false}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
        <div className="min-h-[72px] space-y-1.5">
          {brand && (
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary/80">
              {brand}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-bold leading-6 text-slate-800 transition-colors group-hover:text-primary sm:text-[15px]">
            {name}
          </h3>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          {category && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
              <FiTag className="h-3 w-3 shrink-0" />
              {category}
            </span>
          )}

          <span className="mr-auto inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors group-hover:text-cyan-600">
            جزئیات
            <FiArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
