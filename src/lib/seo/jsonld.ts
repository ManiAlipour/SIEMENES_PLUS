import { SITE_NAME, SITE_URL } from "./site";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.jpg`,
    sameAs: ["https://instagram.com/siemenes.plus1"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+98-919-988-3772",
      contactType: "customer service",
      availableLanguage: ["Persian", "fa"],
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fa-IR",
    description:
      "فروشگاه تخصصی محصولات زیمنس — جستجو با نام محصولات و کد محصولات (MLFB)",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

type ProductJsonLdInput = {
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  modelNumber?: string;
  category?: string;
  slug: string;
  createdAt?: string;
  price?: string | number | null;
};

export function buildProductJsonLd(product: ProductJsonLdInput) {
  const productUrl = `${SITE_URL}/shop/${product.slug}`;
  const sku = product.modelNumber || product.slug;

  const jsonLd: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description?.slice(0, 300),
    image: product.image,
    sku,
    mpn: product.modelNumber || undefined,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : { "@type": "Brand", name: "Siemens" },
    manufacturer: product.brand
      ? { "@type": "Organization", name: product.brand }
      : { "@type": "Organization", name: "Siemens" },
    category: product.category,
    url: productUrl,
    ...(product.createdAt ? { releaseDate: product.createdAt } : {}),
  };

  const priceValue = product.price ? Number(product.price) : 0;

  if (priceValue > 0) {
    jsonLd.offers = {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IRR",
      price: priceValue,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
    };
  }

  return jsonLd;
}

export function buildFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
