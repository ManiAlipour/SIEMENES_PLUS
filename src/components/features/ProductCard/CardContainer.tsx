import React from "react";

interface ProductCardContainerProps {
  children: React.ReactNode;
  className?: string;
  name: string;
}

export default function ProductCardContainer({
  children,
  className = "",
  name,
}: ProductCardContainerProps) {
  return (
    <article
      aria-label={`کارت محصول ${name}`}
      className={`
        group relative flex flex-col
        min-w-44
        bg-white rounded-2xl sm:rounded-3xl
        border border-gray-100 sm:border-cyan-100/80
        shadow-lg sm:shadow-xl
        hover:shadow-xl sm:hover:shadow-[0_25px_50px_-12px_rgba(6,182,212,0.25)]
        hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2
        active:scale-[0.99] sm:active:scale-[0.98]
        transition-all duration-300 sm:duration-500 ease-out
        overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-cyan-100/10
        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
        ${className}
      `}
    >
      {children}
    </article>
  );
}
