export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://siemensplus1.ir";

export const SITE_NAME = "زیمنس پلاس";

export const SITE_AUTHOR = {
  name: "مرتضی مجیدی",
  jobTitle: "مهندس الکترونیک و متخصص ارشد سیستم‌های کنترل CNC زیمنس",
  url: `${SITE_URL}/about-us/morteza-majidi`,
  image: `${SITE_URL}/images/profile/morteza-majidi.webp`,
} as const;

export const SEO_KEYWORDS = [
  "زیمنس",
  "فروشگاه زیمنس",
  "محصولات زیمنس",
  "کد محصولات",
  "نام محصولات",
  "شماره مدل زیمنس",
  "MLFB",
  "PLC زیمنس",
  "اینورتر زیمنس",
  "قطعات زیمنس",
] as const;
