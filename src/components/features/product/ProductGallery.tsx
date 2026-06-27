"use client";

import Image from "next/image";
import { useState } from "react";
import { FiMaximize2, FiPackage } from "react-icons/fi";

type ProductGalleryProps = {
  image?: string;
  alt: string;
  productCode: string;
  brand?: string;
  isFeatured?: boolean;
};

export default function ProductGallery({
  image,
  alt,
  productCode,
  brand,
  isFeatured,
}: ProductGalleryProps) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 shadow-lg shadow-slate-200/40">
        {isFeatured && (
          <span className="absolute left-4 top-4 z-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            محصول ویژه
          </span>
        )}

        {brand && (
          <span className="absolute right-4 top-4 z-20 rounded-xl bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm">
            {brand}
          </span>
        )}

        <button
          type="button"
          onClick={() => image && setZoomed(true)}
          className="group relative block aspect-square w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={image ? "بزرگ‌نمایی تصویر محصول" : undefined}
          disabled={!image}
        >
          {image ? (
            <>
              <Image
                src={image}
                alt={alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-contain p-6 sm:p-10 transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-xl bg-slate-900/75 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <FiMaximize2 className="h-3.5 w-3.5" aria-hidden />
                بزرگ‌نمایی
              </span>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-300">
              <FiPackage className="h-16 w-16" aria-hidden />
              <span className="text-sm font-medium">تصویر در دسترس نیست</span>
            </div>
          )}
        </button>

        <div className="absolute bottom-4 right-4 z-20 max-w-[85%] truncate rounded-xl bg-slate-900/85 px-3 py-2 font-mono text-xs font-semibold tracking-wide text-cyan-100 backdrop-blur-sm">
          MLFB: {productCode}
        </div>
      </div>

      {zoomed && image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="نمایش بزرگ تصویر محصول"
          onClick={() => setZoomed(false)}
          onKeyDown={(e) => e.key === "Escape" && setZoomed(false)}
        >
          <button
            type="button"
            className="absolute left-4 top-4 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
            onClick={() => setZoomed(false)}
          >
            بستن
          </button>
          <div className="relative h-[min(85vh,700px)] w-[min(90vw,700px)]">
            <Image
              src={image}
              alt={alt}
              fill
              sizes="90vw"
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
