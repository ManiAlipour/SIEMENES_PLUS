import Image from "next/image";
import { motion } from "framer-motion";

interface ProductImageProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export default function ProductImage({ src, alt, onClick }: ProductImageProps) {
  return (
    <div
      onClick={onClick}
      className="
          relative aspect-[4/3] sm:aspect-square cursor-pointer
          bg-gradient-to-br from-gray-50 via-white to-gray-100
          overflow-hidden transition-all duration-500
          group-hover:shadow-inner
        "
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        sizes="(max-width:640px)100vw, (max-width:1024px)50vw, 25vw"
        className="
            object-contain p-4 sm:p-6 md:p-10
            transition-all duration-700 will-change-transform
            group-hover:drop-shadow-2xl
          "
      />

      {/* Multi-layered Glow Effects - Desktop Only */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none hidden sm:block"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/15 via-blue-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-300/10 via-transparent to-purple-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
        <div className="absolute inset-0 bg-radial-gradient from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
      </motion.div>

      {/* Decorative Elements - Desktop Only */}
      <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-32 h-8 bg-gradient-to-t from-cyan-100/60 to-transparent rounded-t-full blur-2xl hidden sm:block" />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-4 -right-4 w-16 h-16 bg-cyan-200/20 rounded-full blur-xl hidden sm:block"
      />
    </div>
  );
}
