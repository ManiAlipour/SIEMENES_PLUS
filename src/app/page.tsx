import AboutUs from "@/components/layouts/AboutUs";
import BlogSection from "@/components/layouts/BlogSection";
import CategoriesSection from "@/components/layouts/CategoriesSection";
import CategoryHighlightsSection from "@/components/layouts/CategoryHighlightsSection";
import ContactUs from "@/components/layouts/ContactUs";
import FeaturedProductsSection from "@/components/layouts/FeaturedProductsSection";
import RepairProcess from "@/components/layouts/RepairProcess";
import HeroSection from "@/components/layouts/SectionHero";
import ServiceFeatures from "@/components/layouts/ServiceFeatures";
import LocationSection from "@/components/layouts/Location";
import PublicStats from "@/components/features/PublicStats";
import TopCategoriesSection from "@/components/features/shop/TopCategoriesSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      {/* <CategoriesSection /> */}
      <TopCategoriesSection />
      <FeaturedProductsSection />
      <CategoryHighlightsSection />
      <PublicStats />
      <ServiceFeatures />
      <BlogSection />
      <RepairProcess />
      <AboutUs />
      <ContactUs />
      <LocationSection />
    </div>
  );
}
