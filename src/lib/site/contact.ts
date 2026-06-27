export const OFFICE_PHONE = "09199883772";
export const OFFICE_PHONE_DISPLAY = "۰۹۱۹ ۹۸۸ ۳۷۷۲";
export const WHATSAPP_LINK = "https://wa.me/989199883772";
export const TELEGRAM_LINK = "https://t.me/Majidi_NM";
export const INSTAGRAM_LINK = "https://instagram.com/siemenes.plus1";

export function buildWhatsAppInquiryUrl(productName: string, productCode: string) {
  const text = [
    "سلام، برای استعلام قیمت و موجودی محصول زیر تماس گرفتم:",
    "",
    `📦 نام محصول: ${productName}`,
    `کد MLFB: ${productCode}`,
    "",
    "لطفاً راهنمایی بفرمایید.",
  ].join("\n");

  return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
}
