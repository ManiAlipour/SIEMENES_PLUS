import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/layouts/SectionHero";
import TopCategoriesSection from "@/components/features/shop/TopCategoriesSection";
import FeaturedProductsSection from "@/components/layouts/FeaturedProductsSection";

const CategoryHighlightsSection = dynamic(
  () => import("@/components/layouts/CategoryHighlightsSection"),
  { ssr: true }
);
const PublicStats = dynamic(() => import("@/components/features/PublicStats"), {
  ssr: true,
});
const ServiceFeatures = dynamic(
  () => import("@/components/layouts/ServiceFeatures"),
  { ssr: true }
);
const BlogSection = dynamic(() => import("@/components/layouts/BlogSection"), {
  ssr: true,
});
const RepairProcess = dynamic(
  () => import("@/components/layouts/RepairProcess"),
  { ssr: true }
);
const AboutUs = dynamic(() => import("@/components/layouts/AboutUs"), {
  ssr: true,
});
const ContactUs = dynamic(() => import("@/components/layouts/ContactUs"), {
  ssr: true,
});
const LocationSection = dynamic(
  () => import("@/components/layouts/Location"),
  { ssr: true }
);

function SectionPlaceholder({ h = 200 }: { h?: number }) {
  return (
    <div
      className="w-full animate-pulse bg-gray-100"
      style={{ minHeight: h }}
      aria-hidden
    />
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TopCategoriesSection />
      <FeaturedProductsSection />
      <div style={{ contentVisibility: "auto" }}>
        <Suspense fallback={<SectionPlaceholder h={320} />}>
          <CategoryHighlightsSection />
        </Suspense>
      </div>
      <div style={{ contentVisibility: "auto" }}>
        <Suspense fallback={<SectionPlaceholder h={180} />}>
          <PublicStats />
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
      <div style={{ contentVisibility: "auto" }}>
        <ContactUs />
      </div>
      <div style={{ contentVisibility: "auto" }}>
        <LocationSection />
      </div>
    </div>
  );
}
