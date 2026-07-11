"use client";

import { useCallback, useState } from "react";
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { FiCheck, FiCopy, FiPhone, FiShare2 } from "react-icons/fi";
import {
  buildWhatsAppInquiryUrl,
  INSTAGRAM_LINK,
  OFFICE_PHONE,
  OFFICE_PHONE_DISPLAY,
  TELEGRAM_LINK,
} from "@/lib/site/contact";
import TrackedLink from "@/components/layouts/TrackedLink";

type ProductInquiryPanelProps = {
  productName: string;
  productId: string;
  productUrl: string;
};

export default function ProductInquiryPanel({
  productName,
  productId,
  productUrl,
}: ProductInquiryPanelProps) {
  const [copiedField, setCopiedField] = useState<"id" | "link" | null>(null);

  const copyText = useCallback(async (text: string, field: "id" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, []);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: productName,
      text: `${productName} — شناسه ${productId}`,
      url: productUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled or unsupported */
      }
    }

    await copyText(productUrl, "link");
  }, [copyText, productId, productName, productUrl]);

  const whatsappUrl = buildWhatsAppInquiryUrl(productName, productId);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-bold text-slate-800">
          استعلام قیمت و موجودی
        </p>

        <TrackedLink
          href={whatsappUrl}
          channel="WHATSAPP"
          productName={productName}
          productId={productId}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3.5 text-base font-bold text-white shadow-md shadow-emerald-200/50 transition hover:bg-[#20bd5a]"
        >
          <FaWhatsapp className="h-5 w-5" aria-hidden />
          استعلام سریع در واتساپ
        </TrackedLink>

        <p className="mt-2 text-center text-[11px] text-slate-500">
          پیام با نام و شناسه محصول به‌صورت خودکار ارسال می‌شود
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TrackedLink
          href={`tel:${OFFICE_PHONE}`}
          channel="CALL"
          productName={productName}
          productId={productId}
          className="inline-flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-sm hover:bg-primary/5"
        >
          <FiPhone className="h-4 w-4" aria-hidden />
          <span dir="ltr">{OFFICE_PHONE_DISPLAY}</span>
        </TrackedLink>

        <TrackedLink
          href={TELEGRAM_LINK}
          channel="TELEGRAM"
          productName={productName}
          productId={productId}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1d8fc4]"
        >
          <FaTelegramPlane aria-hidden />
          تلگرام
        </TrackedLink>

        <TrackedLink
          href={INSTAGRAM_LINK}
          channel="INSTAGRAM"
          productName={productName}
          productId={productId}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-pink-500 to-yellow-400 px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          ariaLabel="صفحه اینستاگرام"
        >
          <FaInstagram aria-hidden />
          اینستاگرام
        </TrackedLink>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => copyText(productId, "id")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {copiedField === "id" ? (
            <>
              <FiCheck className="h-4 w-4 text-emerald-600" aria-hidden />
              شناسه کپی شد
            </>
          ) : (
            <>
              <FiCopy className="h-4 w-4" aria-hidden />
              کپی شناسه محصول
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {copiedField === "link" ? (
            <>
              <FiCheck className="h-4 w-4 text-emerald-600" aria-hidden />
              لینک کپی شد
            </>
          ) : (
            <>
              <FiShare2 className="h-4 w-4" aria-hidden />
              اشتراک‌گذاری
            </>
          )}
        </button>
      </div>
    </div>
  );
}
