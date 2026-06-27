"use client";

import { useCallback, useState } from "react";
import {
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FiCheck,
  FiCopy,
  FiPhone,
  FiShare2,
} from "react-icons/fi";
import {
  buildWhatsAppInquiryUrl,
  INSTAGRAM_LINK,
  OFFICE_PHONE,
  OFFICE_PHONE_DISPLAY,
  TELEGRAM_LINK,
} from "@/lib/site/contact";

type ProductInquiryPanelProps = {
  productName: string;
  productCode: string;
  productUrl: string;
};

export default function ProductInquiryPanel({
  productName,
  productCode,
  productUrl,
}: ProductInquiryPanelProps) {
  const [copiedField, setCopiedField] = useState<"code" | "link" | null>(null);

  const copyText = useCallback(async (text: string, field: "code" | "link") => {
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
      text: `${productName} — کد ${productCode}`,
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
  }, [copyText, productCode, productName, productUrl]);

  const whatsappUrl = buildWhatsAppInquiryUrl(productName, productCode);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-bold text-slate-800">
          استعلام قیمت و موجودی
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3.5 text-base font-bold text-white shadow-md shadow-emerald-200/50 transition hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        >
          <FaWhatsapp className="h-5 w-5" aria-hidden />
          استعلام سریع در واتساپ
        </a>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          پیام با نام و کد محصول به‌صورت خودکار ارسال می‌شود
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`tel:${OFFICE_PHONE}`}
          className="inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl border border-primary/25 bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-sm transition hover:bg-primary/5"
          aria-label={`تماس: ${OFFICE_PHONE_DISPLAY}`}
        >
          <FiPhone className="h-4 w-4" aria-hidden />
          {OFFICE_PHONE_DISPLAY}
        </a>
        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1d8fc4]"
          aria-label="تماس از طریق تلگرام"
        >
          <FaTelegramPlane aria-hidden />
          تلگرام
        </a>
        <a
          href={INSTAGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-pink-500 to-yellow-400 px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          aria-label="صفحه اینستاگرام"
        >
          <FaInstagram aria-hidden />
          اینستاگرام
        </a>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => copyText(productCode, "code")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {copiedField === "code" ? (
            <>
              <FiCheck className="h-4 w-4 text-emerald-600" aria-hidden />
              کد کپی شد
            </>
          ) : (
            <>
              <FiCopy className="h-4 w-4" aria-hidden />
              کپی کد MLFB
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
