"use client";

import ProductCard from "@/components/features/ProductCard";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  brand: string;
  modelNumber?: string;
  image?: string;
  description?: string;
  slug: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products?.length) {
    return (
      <div className="text-center text-gray-500 py-16">
        هیچ محصولی یافت نشد 💤
      </div>
    );
  }

  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                 animate-fade-in"
    >
      {products.map((p, i) => (
        <motion.div
          key={p._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <ProductCard
            id={p._id}
            name={p.name}
            // brand={p.brand as string}
            // modelNumber={p.modelNumber}
            image={p.image || ""}
            //slug={p.slug}
            // description={p.description?.slice(0, 80) || ""}
          />
        </motion.div>
      ))}
    </div>
  );
}
