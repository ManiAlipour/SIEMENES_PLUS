import { SEO_KEYWORDS } from "@/lib/seo/site";

export function buildProductDescription(product: Product): string {
  const code = product.modelNumber ? `کد ${product.modelNumber}` : "";
  const brand = product.brand ? `برند ${product.brand}` : "زیمنس";
  const base =
    product.description?.trim().slice(0, 140) ||
    `${product.name} از محصولات ${brand}`;
  return `${base}${code ? ` — ${code}` : ""}. خرید و استعلام قیمت از فروشگاه زیمنس پلاس با ضمانت اصالت.`;
}

export function buildProductTitle(product: Product): string {
  const code = product.modelNumber ? ` | کد ${product.modelNumber}` : "";
  return `${product.name}${code} | فروشگاه زیمنس پلاس`;
}

export function buildProductKeywords(product: Product): string[] {
  return [
    product.name,
    product.modelNumber,
    product.brand,
    product.category,
    "زیمنس",
    "محصولات زیمنس",
    "فروشگاه زیمنس",
    "کد محصولات",
    "MLFB",
    ...SEO_KEYWORDS.slice(0, 4),
  ].filter((k): k is string => Boolean(k && String(k).trim()));
}

export type ProductFAQ = { question: string; answer: string };

export function buildProductFaqs(
  product: Product,
  productCode: string,
): ProductFAQ[] {
  const brand = product.brand || "زیمنس (Siemens)";
  const category = product.category || "تجهیزات صنعتی";

  return [
    {
      question: `کد MLFB محصول ${product.name} چیست؟`,
      answer: `کد MLFB (شماره مدل) این محصول ${productCode} است. هنگام استعلام قیمت یا سفارش، حتماً این کد را ذکر کنید تا پاسخ سریع‌تر و دقیق‌تر دریافت کنید.`,
    },
    {
      question: `چگونه قیمت ${product.name} را استعلام کنم؟`,
      answer: `برای استعلام قیمت ${product.name} می‌توانید از طریق واتساپ، تماس تلفنی یا اینستاگرام فروشگاه زیمنس پلاس اقدام کنید. ارسال نام محصول (${product.name}) یا کد ${productCode} کافی است.`,
    },
    {
      question: `آیا ${product.name} اصل و اورجینال است؟`,
      answer: `بله. تمامی محصولات ${brand} در زیمنس پلاس با ضمانت اصالت و پشتیبانی فنی ارائه می‌شوند. این محصول در دسته ${category} قرار دارد.`,
    },
    {
      question: "زمان تحویل و ارسال چقدر است؟",
      answer:
        "زمان تحویل بسته به موجودی انبار و شهر مقصد متغیر است. پس از استعلام، همکاران ما زمان تقریبی ارسال و هزینه حمل را اعلام می‌کنند.",
    },
    {
      question: "آیا مشاوره فنی برای انتخاب محصول ارائه می‌شود؟",
      answer:
        "بله. تیم مهندسی زیمنس پلاس قبل از خرید، در انتخاب مدل مناسب، جایگزین‌سازی و سازگاری با سیستم شما مشاوره رایگان ارائه می‌دهد.",
    },
  ];
}
