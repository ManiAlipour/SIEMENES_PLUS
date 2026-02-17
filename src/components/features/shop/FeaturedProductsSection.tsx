"use client";

import { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products?isFeatured=true&limit=8");
        const data = await res.json();
        if (data.success) {
          setProducts(data.items || []);
        }
      } catch (err) {
        console.error("خطا در دریافت محصولات ویژه:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border-2 border-gray-200 animate-pulse overflow-hidden shadow-lg"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 md:mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-primary via-cyan-500 to-blue-600 rounded-3xl shadow-2xl shadow-primary/40">
            <IoSparkles className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              محصولات ویژه
            </h2>
            <p className="text-base md:text-lg text-gray-600 font-medium">
              بهترین و محبوب‌ترین محصولات ما
            </p>
          </div>
        </div>
        <Link
            href="/shop?sort=-createdAt"
            className="inline-flex items-center gap-2 text-primary hover:text-cyan-600 font-bold transition-colors px-6 py-3 rounded-2xl hover:bg-primary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 text-base md:text-lg"
          >
            <span>مشاهده همه</span>
            <FiArrowLeft className="w-5 h-5" />
          </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {products.map((product) => (
          <div key={product._id} className="h-full">
            <ProductCard
              id={product._id}
              name={product.name}
              image={product.image}
              brand={product.brand}
              isFeatured={product.isFeatured}
              slug={product.slug}
              className="h-full rounded-3xl shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-primary/30 bg-white transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
