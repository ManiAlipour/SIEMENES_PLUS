import { motion, AnimatePresence } from "framer-motion";
import { FiStar } from "react-icons/fi";

interface ProductBadgeProps {
  isFeatured?: boolean;
}

export default function ProductBadge({ isFeatured }: ProductBadgeProps) {
  return (
    <AnimatePresence>
      {isFeatured && (
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{
            scale: 1,
            rotate: 0,
            opacity: 1,
            y: [0, -3, 0],
          }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="
            absolute top-3 left-3 sm:top-4 sm:left-4 z-30
            bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400
            text-white text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2
            rounded-xl sm:rounded-2xl shadow-xl
            border-2 border-white/80 backdrop-blur-md select-none
          "
        >
          <div className="flex items-center gap-1.5">
            <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-white drop-shadow-lg" />
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              ویژه
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
