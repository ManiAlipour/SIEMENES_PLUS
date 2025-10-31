"use client";

import React from "react";
import ProductCard from "../features/ProductCard";
import { highlightedCategories } from "@/data/highlighted-categories";

export default function CategoryHighlightsSection() {
  return (
    <section className="pt-16 md:pt-20 pb-12 md:pb-16 w-full pt-20 pb-10 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-vazir-bold text-gray-800 text-center mb-12 tracking-tight">
          دسته‌های منتخب ما
        </h2>

        {highlightedCategories.map((category) => (
          <div key={category.id} className="mb-16">
            {/* Category header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-vazir-semibold text-gray-700 tracking-tight">
                {category.title}
              </h3>
              <button className="text-primary border border-primary rounded-md px-3 py-1.5 text-sm font-vazir-medium hover:bg-primary/5 transition-all duration-300">
                مشاهده همه
              </button>
            </div>

            {/* Horizontal scrollable products list */}
            <div
              className="
                flex gap-4 items-stretch  overflow-x-auto snap-x snap-mandatory
                scroll-smooth scrollbar-hide pb-3
              "
            >
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className="
                    min-w-[220px] md:min-w-[280px] snap-start flex-shrink-0
                  "
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    className="h-full hover:shadow-md hover:-translate-y-[2px] transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
