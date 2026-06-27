"use client";

import { Suspense } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import LikeButton from "@/app/(store)/shop/[slug]/LikeButton";
import {
  buildWhatsAppInquiryUrl,
  OFFICE_PHONE,
} from "@/lib/site/contact";

type ProductStickyBarProps = {
  productId: string;
  productName: string;
  productCode: string;
};

export default function ProductStickyBar({
  productId,
  productName,
  productCode,
}: ProductStickyBarProps) {
  const whatsappUrl = buildWhatsAppInquiryUrl(productName, productCode);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
      role="region"
      aria-label="دسترسی سریع به خرید"
    >
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white"
        >
          <FaWhatsapp className="h-5 w-5" aria-hidden />
          واتساپ
        </a>
        <a
          href={`tel:${OFFICE_PHONE}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-primary"
          aria-label="تماس تلفنی"
        >
          <FiPhone className="h-5 w-5" />
        </a>
        <div className="shrink-0 [&_button]:px-3 [&_button]:py-2.5 [&_button]:text-sm">
          <Suspense>
            <LikeButton productId={productId} productName={productName} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
