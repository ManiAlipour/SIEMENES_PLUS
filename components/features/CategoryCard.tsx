"use client";

import Image from "next/image";

interface CategoryCardProps {
  title: string;
  image: string;
}

export default function CategoryCard({ title, image }: CategoryCardProps) {
  return (
    <div
      className="
        flex flex-col items-center text-center font-vazir
        bg-card rounded-xl border border-gray-100 shadow-soft overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:brightness-110 hover:shadow-lg hover:border-primary/30
      "
    >
      <div className="relative w-full h-[clamp(140px,25vw,180px)]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="50vw"
          className="
            object-cover object-center
            after:absolute after:inset-0 after:bg-gradient-to-t after:from-white/20 after:to-transparent
          "
        />
      </div>
      <div className="py-3 px-2 text-[15px] md:text-[16px] text-foreground font-vazir-semibold tracking-tight">
        {title}
      </div>
    </div>
  );
}
