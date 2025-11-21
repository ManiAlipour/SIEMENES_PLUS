import type { Metadata } from "next";
import ShopPageClient from "./ShopPageClient";

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
        url: "/images/logo.jpg",
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
    images: ["/images/logo.jpg"],
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

// JSON-LD Structured Data
function generateJsonLd() {
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
      itemListElement: [],
    },
  };
}

export default function ShopPage() {
  const jsonLd = generateJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopPageClient />
    </>
  );
}
