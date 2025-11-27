import { motion } from "framer-motion";
import { FiEye, FiShoppingCart } from "react-icons/fi";
import LikeButton from "../LikeProduct";

interface ProductActionsProps {
  id: string;
  brand?: string;
  onQuickView?: (e: React.MouseEvent) => void;
  onAddToCart?: (e: React.MouseEvent) => void;
}

export function MobileActions({ id }: { id: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="absolute top-3 right-3 sm:hidden z-20"
    >
      <LikeButton
        id={id}
        className="
            flex items-center justify-center
            w-10 h-10 bg-white/95 backdrop-blur-sm
            hover:bg-white text-gray-600 hover:text-red-500
            rounded-full transition-all duration-300
            active:scale-95 border border-gray-200
            shadow-lg hover:shadow-xl
          "
      />
    </motion.div>
  );
}

export function DesktopTopActions({
  id,
  brand,
}: {
  id: string;
  brand?: string;
}) {
  return (
    <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-3">
      {brand && (
        <motion.span
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="
              bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50
              text-xs font-bold px-3 py-1.5 rounded-xl
              border border-blue-200/70 text-blue-800 shadow-lg
              backdrop-blur-sm tracking-tight select-none
            "
        >
          {brand}
        </motion.span>
      )}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <LikeButton
          className="
              flex items-center justify-center rounded-full
              border-2 border-cyan-200/80 bg-white/95
              hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50
              text-cyan-500 hover:text-red-500 w-10 h-10
              transition-all duration-300 shadow-lg hover:shadow-xl
              hover:scale-110 active:scale-95 backdrop-blur-sm
            "
          id={id}
        />
      </motion.div>
    </div>
  );
}

export function DesktopFloatingActions({
  onQuickView,
  onAddToCart,
}: Pick<ProductActionsProps, "onQuickView" | "onAddToCart">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-16 right-4 z-20 hidden sm:flex flex-col gap-2"
    >
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg
                       flex items-center justify-center text-cyan-600 hover:text-cyan-800
                       transition-all duration-200 border border-cyan-200/50"
        onClick={onQuickView}
        aria-label="مشاهده سریع"
      >
        <FiEye className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg
                       flex items-center justify-center text-pink-600 hover:text-pink-800
                       transition-all duration-200 border border-pink-200/50"
        onClick={onAddToCart}
        aria-label="افزودن به سبد خرید"
      >
        <FiShoppingCart className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
