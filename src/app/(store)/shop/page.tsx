import type { Metadata } from "next";
import { Suspense } from "react";
import ShopPageClient from "./ShopPageClient";
import LoadingFallback from "./LoadingFallback";
import Script from "next/script";

export const metadata: Metadata = {
  title: "فروشگاه محصولات | زیمنس پلاس",
  description:
    "فروشگاه تخصصی تجهیزات اتوماسیون صنعتی، PLC، اینورتر، HMI و قطعات زیمنس. بهترین قیمت و پشتیبانی فنی حرفه‌ای.",
  keywords: [
    "فروشگاه محصولات صنعتی",
    "PLC زیمنس",
    "اینورتر صنعتی",
    "HMI",
    "اتوماسیون صنعتی",
    "قطعات زیمنس",
    "تجهیزات صنعتی",
  ],
  openGraph: {
    title: "فروشگاه محصولات | زیمنس پلاس",
    description:
      "فروشگاه تخصصی تجهیزات اتوماسیون صنعتی، PLC، اینورتر، HMI و قطعات زیمنس",
    type: "website",
    locale: "fa_IR",
    siteName: "زیمنس پلاس",
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir"
        }/images/logo.jpg`,
        width: 1200,
        height: 630,
        alt: "زیمنس پلاس - فروشگاه محصولات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "فروشگاه محصولات | زیمنس پلاس",
    description:
      "فروشگاه تخصصی تجهیزات اتوماسیون صنعتی، PLC، اینورتر، HMI و قطعات زیمنس",
    images: [
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir"
      }/images/logo.jpg`,
    ],
  },
  alternates: {
    canonical: "/shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function generateJsonLd(products: any[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "فروشگاه محصولات زیمنس پلاس",
    description:
      "فروشگاه تخصصی تجهیزات اتوماسیون صنعتی، PLC، اینورتر، HMI و قطعات زیمنس",
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir"
    }/shop`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "Product",
        position: index + 1,
        name: product.title,
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir"
        }/product/${product.slug}`,
      })),
    },
  };
}

export default function ShopPage() {
  const jsonLd = generateJsonLd([]);

  return (
    <>
      {/* Structured data (for SEO parsers) */}
      <Script
        id="shop-jsonld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      {/* Suspense allows lazy hydration for subloads */}
      <Suspense fallback={<LoadingFallback />}>
        <ShopPageClient />
      </Suspense>
    </>
  );
}
