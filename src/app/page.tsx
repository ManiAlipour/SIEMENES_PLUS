import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/layouts/SectionHero";
import CategoryHighlightsSection from "@/components/layouts/CategoryHighlightsSection";
import ServiceFeatures from "@/components/layouts/ServiceFeatures";
import { getCategoryHighlights } from "@/lib/categories/highlights";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld";
import { SEO_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "زیمنس پلاس | فروشگاه زیمنس | محصولات زیمنس",
  description:
    "فروشگاه زیمنس پلاس — خرید محصولات زیمنس با جستجوی نام محصولات و کد محصولات (MLFB). PLC، اینورتر، HMI و قطعات با ضمانت و پشتیبانی فنی.",
  keywords: [...SEO_KEYWORDS],
  openGraph: {
    title: "زیمنس پلاس | فروشگاه زیمنس | محصولات زیمنس",
    description:
      "فروشگاه تخصصی محصولات زیمنس — جستجو با نام محصولات و کد محصولات",
    url: SITE_URL,
    locale: "fa_IR",
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/logo.jpg`,
        width: 1200,
        height: 630,
        alt: "فروشگاه زیمنس پلاس",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "زیمنس پلاس | فروشگاه زیمنس",
    description: "خرید محصولات زیمنس — جستجو با نام و کد محصولات",
    images: [`${SITE_URL}/images/logo.jpg`],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const revalidate = 120;

const VideosSection = dynamic(
  () => import("@/components/layouts/VideosSection"),
  { loading: () => <SectionPlaceholder h={320} /> },
);
const BlogSection = dynamic(() => import("@/components/layouts/BlogSection"), {
  loading: () => <SectionPlaceholder h={400} />,
});
const RepairProcess = dynamic(
  () => import("@/components/layouts/RepairProcess"),
  { loading: () => <SectionPlaceholder h={280} /> },
);
const AboutUs = dynamic(() => import("@/components/layouts/AboutUs"), {
  loading: () => <SectionPlaceholder h={360} />,
});
const ContactUs = dynamic(() => import("@/components/layouts/ContactUs"), {
  loading: () => <SectionPlaceholder h={280} />,
});
const LocationSection = dynamic(() => import("@/components/layouts/Location"), {
  loading: () => <SectionPlaceholder h={360} />,
});
const ContactCTA = dynamic(() => import("@/components/layouts/ContactCTA"), {
  loading: () => <SectionPlaceholder h={120} />,
});

function SectionPlaceholder({ h = 200 }: { h?: number }) {
  return (
    <div
      className="w-full bg-slate-100/80"
      style={{ minHeight: h }}
      aria-hidden
    />
  );
}

export default async function Home() {
  const categories = await getCategoryHighlights();
  const jsonLd = [buildOrganizationJsonLd(), buildWebSiteJsonLd()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <HeroSection />
        <ServiceFeatures />
        <CategoryHighlightsSection categories={categories} />

        <Suspense fallback={<SectionPlaceholder h={320} />}>
          <VideosSection />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder h={400} />}>
          <BlogSection />
        </Suspense>

        <RepairProcess />
        <AboutUs />
        <ContactCTA />
        <ContactUs />
        <LocationSection />
      </main>
    </>
  );
}
