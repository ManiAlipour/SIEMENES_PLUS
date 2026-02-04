import { motion, useMotionValue, useTransform } from "framer-motion";
import React from "react";

interface ProductCardContainerProps {
  children: React.ReactNode;
  className?: string;
  name: string; // For accessibility label
}

export default function ProductCardContainer({
  children,
  className = "",
  name,
}: ProductCardContainerProps) {
  // Mouse tracking for 3D effect (desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      viewport={{ once: true, margin: "-50px" }}
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
        transition-all duration-500 sm:duration-700 ease-out
        overflow-hidden backdrop-blur-sm
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-cyan-100/10
        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        ${className}
      `}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.article>
  );
}
