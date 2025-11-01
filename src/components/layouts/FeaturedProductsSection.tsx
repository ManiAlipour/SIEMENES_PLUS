"use client";

import withFixedBg from "../common/withFixedBg";
import ProductCard from "../features/ProductCard";

const products = [
  {
    id: 1,
    name: "PLC S7-1200 زیمنس",
    image: "/images/products/plc.png",
    price: 16800000,
  },
  {
    id: 2,
    name: "اینورتر SINAMICS G120",
    image: "/images/products/inverter.png",
    price: 24500000,
  },
  {
    id: 3,
    name: "نمایشگر HMI KTP700",
    image: "/images/products/hmi.png",
    price: 12500000,
  },
  {
    id: 4,
    name: "سنسور نوری SICK",
    image: "/images/products/sensor.png",
    price: 4200000,
  },
  {
    id: 5,
    name: "سوییچ شبکه صنعتی SCALANCE",
    image: "/images/products/scalance.png",
    price: 9800000,
  },
  {
    id: 6,
    name: "کنتاکتور و قطع‌کننده زیمنس",
    image: "/images/products/contactor.png",
    price: 3400000,
  },
];

function FeaturedProductsSection() {
  return (
    <section
      dir="rtl"
      className="pt-16 md:pt-20 pb-12 md:pb-16 w-full bg-background text-center"
      aria-labelledby="featured-products-heading"
    >
      <h2
        id="featured-products-heading"
        className="text-foreground font-vazir-extrabold text-2xl md:text-3xl tracking-tight mb-6 md:mb-10"
      >
        محصولات پیشنهادی
      </h2>

      <div
        className="
         grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch
          max-w-6xl mx-auto px-4 md:px-0
        "
      >
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>

      <button
        className="
          mt-[clamp(1.5rem,5vh,3rem)]
          bg-primary/90 text-white font-vazir-semibold text-sm md:text-base
          px-8 md:px-10 py-2.5 md:py-3 rounded-xl shadow-md hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2
        "
        aria-label="مشاهده همه محصولات"
      >
        مشاهده همه محصولات
      </button>
    </section>
  );
}

// const FeaturedProductsWithBg = withFixedBg(FeaturedProductsSection, {
//   backgroundImage: "/images/section-two-bg.jpg",
//   overlayColor: "#000",
//   overlayOpacity: 0.25,
//   minHeight: "auto",
//   className: "py-16 md:py-20",
// });

// export default FeaturedProductsWithBg

export default FeaturedProductsSection;
