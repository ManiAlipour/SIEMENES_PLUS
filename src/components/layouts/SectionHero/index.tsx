import { SLIDES } from "./hero.data";
import HeroSliderClient from "./HeroSlider";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-black"
      dir="rtl"
      aria-label="بخش معرفی خدمات و محصولات زیمنس"
    >
      <HeroSliderClient slides={SLIDES} />
    </section>
  );
}
