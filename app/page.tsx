import CategoriesSection from "@/components/layouts/CategoriesSection";
import CategoryHighlightsSection from "@/components/layouts/CategoryHighlightsSection";
import FeaturedProductsSection from "@/components/layouts/FeaturedProductsSection";
import HeroSection from "@/components/layouts/SectionHero";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />

      <CategoryHighlightsSection />
    </div>
  );
}
