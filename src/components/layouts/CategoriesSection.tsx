"use client";

import CategoryCard from "../features/CategoryCard";

const categories = [
  { title: "اتوماسیون صنعتی", image: "/images/categories/automation.png" },
  { title: "الکترونیک صنعتی", image: "/images/categories/electronics.png" },
  { title: "موتور و کنترل", image: "/images/categories/motor.png" },
  { title: "ابزار دقیق", image: "/images/categories/instrumentation.png" },
  { title: "تجهیزات ایمنی", image: "/images/categories/safety.png" },
  { title: "لوازم جانبی", image: "/images/categories/accessories.png" },
];

export default function CategoriesSection() {
  return (
    <section className="pt-16 md:pt-20 pb-12 md:pb-16 w-full py-[clamp(2rem,6vw,4rem)] bg-background text-center">
      <h2 className="text-2xl font-vazir-bold text-gray-800 text-center mb-8 relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-[2px] after:bg-primary">
        دسته‌بندی‌های محصولات
      </h2>

      <div
        className="
          grid grid-cols-2 sm:grid-cols-3 gap-[clamp(1rem,3vw,2rem)]
          max-w-7xl mx-auto px-6
        "
      >
        {categories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>

      <div className="mt-[clamp(2rem,5vw,3rem)]">
        <button
          className="
            bg-primary text-white font-vazir font-medium px-6 py-3
            rounded-xl shadow-md transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5
          "
        >
          مشاهده همه دسته‌ها
        </button>
      </div>
    </section>
  );
}
