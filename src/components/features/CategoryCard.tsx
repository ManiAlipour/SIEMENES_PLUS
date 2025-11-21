"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  image: string;
  slug?: string;
}

export default function CategoryCard({ title, image, slug }: CategoryCardProps) {
  const href = slug ? `/shop?category=${slug}` : "/shop";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className="group flex flex-col items-center text-center font-vazir bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary"
      >
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="py-4 px-3 w-full bg-white">
          <h3 className="text-sm md:text-base text-gray-900 font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
