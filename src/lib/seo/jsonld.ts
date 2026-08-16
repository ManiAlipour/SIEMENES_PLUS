import { SITE_AUTHOR, SITE_NAME, SITE_URL } from "./site";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.jpg`,
    sameAs: ["https://instagram.com/siemenes.plus1"],
    founder: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
    },
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
  averageRating?: number;
  reviewCount?: number;
  reviews?: Array<{
    rating: number;
    text: string;
    title?: string;
    createdAt?: string;
    authorName?: string;
  }>;
};

export function buildProductJsonLd(product: ProductJsonLdInput) {
  const productUrl = `${SITE_URL}/shop/${product.slug}`;
  const sku = product.modelNumber || product.slug;

  const jsonLd: Record<string, unknown> = {
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

  if (product.reviewCount && product.reviewCount > 0 && product.averageRating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    jsonLd.review = product.reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        "@type": "Person",
        name: r.authorName || "کاربر",
      },
      ...(r.createdAt ? { datePublished: r.createdAt } : {}),
      ...(r.title ? { name: r.title } : {}),
      reviewBody: r.text,
    }));
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

type ArticleJsonLdInput = {
  title: string;
  description?: string;
  image?: string;
  slug: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
  articleSection?: string;
};

export function buildArticleJsonLd(article: ArticleJsonLdInput) {
  const url = `${SITE_URL}/blog/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description || article.title,
    image: article.image || `${SITE_URL}/images/logo.jpg`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    inLanguage: "fa-IR",
    author: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
      jobTitle: SITE_AUTHOR.jobTitle,
      image: SITE_AUTHOR.image,
      worksFor: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(article.keywords?.length ? { keywords: article.keywords } : {}),
    ...(article.articleSection
      ? { articleSection: article.articleSection }
      : {}),
    ...(article.keywords?.length
      ? {
          about: article.keywords.map((t) => ({
            "@type": "Thing",
            name: t,
          })),
        }
      : {}),
  };
}
