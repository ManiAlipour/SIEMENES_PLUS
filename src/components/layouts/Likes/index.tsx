"use client";

import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BsBagHeart,
  BsHeartbreak,
  BsArrowRight,
  BsTrash,
  BsCartPlus,
} from "react-icons/bs";
import ProductCard from "@/components/features/ProductCard"; // کارت اصلی (گرید)
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toggleLike } from "@/store/slices/likedPosts"; // فرض بر این است که این اکشن را دارید

// --- 1. Skeleton Loading (Mobile & Desktop) ---
const SkeletonGrid = () => (
  <>
    {/* Mobile Skeleton (List) */}
    <div className="md:hidden space-y-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3 flex gap-3 border border-gray-100"
        >
          <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-full mt-1 animate-pulse" />
          </div>
        </div>
      ))}
    </div>

    {/* Desktop Skeleton (Grid) */}
    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3"
        >
          <div className="w-full aspect-4/3 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      ))}
    </div>
  </>
);

// --- 2. Mobile List Item Component ---
const MobileListItem = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();

  // هندل کردن حذف آیتم
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLike(product._id));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }} // افکت حذف شدن به چپ
      className="bg-white rounded-xl p-3 flex gap-3 border border-gray-100 shadow-sm mb-3 relative overflow-hidden group"
    >
      {/* Image */}
      <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.brand && (
            <span className="text-xs text-gray-500 mt-1 block">
              {product.brand}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleRemove}
              className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
            >
              <BsTrash size={16} />
            </button>

            <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              <BsCartPlus size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LikesPageComp() {
  const likedPosts = useSelector((state: RootState) => state.likedPosts);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (!likedPosts || likedPosts.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: likedPosts }),
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchLikedProducts();
  }, [likedPosts]);

  // Variants for Desktop Grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h1 className="flex items-center gap-2 text-xl md:text-3xl font-extrabold text-gray-800">
          <span className="bg-primary/10 text-primary p-2 rounded-xl">
            <BsBagHeart size={20} className="md:w-7 md:h-7" />
          </span>
          علاقه‌مندی‌ها
        </h1>

        {!loading && products.length > 0 && (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
            {products.length} کالا
          </span>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <SkeletonGrid />
      ) : products.length === 0 ? (
        // Empty State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
        >
          <BsHeartbreak className="text-gray-300 mb-4" size={48} />
          <h4 className="text-lg font-bold text-gray-800 mb-2">
            لیست خالی است
          </h4>
          <Link
            href="/shop"
            className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
          >
            مشاهده محصولات <BsArrowRight />
          </Link>
        </motion.div>
      ) : (
        <>
          {/* === MOBILE VIEW (List) === */}
          <div className="md:hidden">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <MobileListItem key={product._id} product={product} />
              ))}
            </AnimatePresence>
          </div>

          {/* === DESKTOP VIEW (Grid) === */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {products.map((product) => (
                <motion.div key={product._id} variants={itemVariants} layout>
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    image={product.image}
                    brand={product.brand}
                    isFeatured={product.isFeatured}
                    slug={product.slug}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
}
