import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { cookies } from "next/headers";
import ShopPageClient from "./ShopPageClient";
import LoadingFallback from "./LoadingFallback";
import { queryProducts } from "@/lib/products/query";
import { logSearchQuery, normalizeSearchQuery } from "@/lib/analytics/search";
import { verifyToken } from "@/lib/auth";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://siemensplus1.ir";

export const metadata: Metadata = {
  title: "فروشگاه زیمنس | محصولات زیمنس | زیمنس پلاس",
  description:
    "فروشگاه زیمنس پلاس — جستجو و خرید محصولات زیمنس با نام محصولات و کد محصولات (MLFB). PLC، اینورتر، HMI و قطعات با پشتیبانی فنی.",
  keywords: [
    "فروشگاه زیمنس",
    "محصولات زیمنس",
    "زیمنس",
    "کد محصولات",
    "نام محصولات",
    "PLC زیمنس",
    "اینورتر صنعتی",
    "HMI",
    "قطعات زیمنس",
    "شماره مدل زیمنس",
  ],
  openGraph: {
    title: "فروشگاه زیمنس | محصولات زیمنس",
    description:
      "جستجو با نام محصولات و کد محصولات — فروشگاه تخصصی محصولات زیمنس",
    type: "website",
    locale: "fa_IR",
    siteName: "زیمنس پلاس",
    images: [
      {
        url: `${siteUrl}/images/logo.jpg`,
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
      "فروشگاه تخصصی تجهیزات صنعتی، PLC، اینورتر، HMI و قطعات زیمنس",
    images: [`${siteUrl}/images/logo.jpg`],
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

type ShopPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

function normalizeImageUrl(image: string) {
  return image.replace(/^https?:\/\/localhost:\d+/, "");
}

async function logProductSearch(search: string, total: number, meta: Record<string, unknown>) {
  try {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("token")?.value;
    let userId: string | null = null;
    if (tokenValue) {
      try {
        userId = verifyToken(tokenValue).id;
      } catch {
        userId = null;
      }
    }

    await logSearchQuery({
      query: search,
      normalizedQuery: normalizeSearchQuery(search),
      totalResults: total,
      source: "products",
      userId,
      meta,
    });
  } catch (err) {
    console.error("SearchQuery log failed (shop page):", err);
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const search = (params.search || "").trim();
  const category = params.category || "";
  const sort = params.sort || "-createdAt";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const { items, total, pages } = await queryProducts({
    search,
    category,
    sort,
    page,
    limit: 12,
  });

  if (search && page === 1) {
    await logProductSearch(search, total, { category, sort });
  }

  const products = items.map((p) => ({
    ...p,
    image: normalizeImageUrl(p.image),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "فروشگاه محصولات زیمنس پلاس",
    description:
      "فروشگاه تخصصی تجهیزات صنعتی، PLC، اینورتر، HMI و قطعات زیمنس",
    url: `${siteUrl}/shop`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: products.slice(0, 12).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          sku: product.modelNumber || product._id,
          brand: product.brand,
          image: product.image,
          url: `${siteUrl}/shop/${product.slug}`,
        },
      })),
    },
  };

  return (
    <>
      <Script
        id="shop-jsonld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      <Suspense fallback={<LoadingFallback />}>
        <ShopPageClient
          products={products}
          total={total}
          pages={pages}
          currentPage={page}
          search={search}
          category={category}
          sort={sort}
        />
      </Suspense>
    </>
  );
}
