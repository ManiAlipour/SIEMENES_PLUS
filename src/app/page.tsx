import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/layouts/SectionHero";
import TopCategoriesSection from "@/components/features/shop/TopCategoriesSection";
import FeaturedProductsSection from "@/components/layouts/FeaturedProductsSection";

export const metadata: Metadata = {
  title: "زیمنس پلاس | اتوماسیون و قطعات صنعتی | فروش و تعمیرات تخصصی",
  description:
    "فروش و پشتیبانی تخصصی تجهیزات اتوماسیون صنعتی زیمنس. PLC، اینورتر، HMI، درایو و قطعات صنعتی با بهترین قیمت و گارانتی.",
  openGraph: {
    title: "زیمنس پلاس | اتوماسیون و قطعات صنعتی",
    description: "فروش و تعمیرات تخصصی تجهیزات زیمنس. PLC، اینورتر، HMI و قطعات صنعتی.",
    url: "/",
  },
  alternates: { canonical: "/" },
};

async function getFeaturedProducts() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9711";
  try {
    const res = await fetch(`${base}/api/products?isFeatured=true&limit=8`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (data.success && data.items?.length > 0) return data.items;
    const fallback = await fetch(`${base}/api/products?limit=6`, {
      next: { revalidate: 60 },
    });
    const fallbackData = await fallback.json();
    return fallbackData.success ? fallbackData.items || [] : [];
  } catch {
    return [];
  }
}

const CategoryHighlightsSection = dynamic(
  () => import("@/components/layouts/CategoryHighlightsSection"),
  { ssr: true },
);
const ServiceFeatures = dynamic(
  () => import("@/components/layouts/ServiceFeatures"),
  { ssr: true },
);
const BlogSection = dynamic(() => import("@/components/layouts/BlogSection"), {
  ssr: true,
});
const RepairProcess = dynamic(
  () => import("@/components/layouts/RepairProcess"),
  { ssr: true },
);
const AboutUs = dynamic(() => import("@/components/layouts/AboutUs"), {
  ssr: true,
});
const ContactUs = dynamic(() => import("@/components/layouts/ContactUs"), {
  ssr: true,
});
const LocationSection = dynamic(() => import("@/components/layouts/Location"), {
  ssr: true,
});

function SectionPlaceholder({ h = 200 }: { h?: number }) {
  return (
    <div
      className="w-full animate-pulse bg-gray-100"
      style={{ minHeight: h }}
      aria-hidden
    />
  );
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  return (
    <div>
      <HeroSection />
      <TopCategoriesSection />
      <FeaturedProductsSection initialProducts={featuredProducts} />
      <div style={{ contentVisibility: "auto" }}>
        <Suspense fallback={<SectionPlaceholder h={320} />}>
          <CategoryHighlightsSection />
        </Suspense>
      </div>
      <div style={{ contentVisibility: "auto" }}>
        <ServiceFeatures />
      </div>
      <div style={{ contentVisibility: "auto" }}>
        <Suspense fallback={<SectionPlaceholder h={400} />}>
          <BlogSection />
        </Suspense>
      </div>
      <div style={{ contentVisibility: "auto" }}>
        <RepairProcess />
      </div>
      <div style={{ contentVisibility: "auto" }}>
        <AboutUs />
      </div>
      {/* ContactCTA section added here */}
      <div style={{ contentVisibility: "auto" }}>
        {/** Dynamically import ContactCTA if desired, or static import if always included */}
        {(() => {
          const ContactCTA = require('@/components/layouts/ContactCTA').default;
          return <ContactCTA />;
        })()}
      </div>
      <div style={{ contentVisibility: "auto" }}>
        <ContactUs />
      </div>
      <div style={{ contentVisibility: "auto" }}>
        <LocationSection />
      </div>
    </div>
  );
}
