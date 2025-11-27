import { motion, AnimatePresence } from "framer-motion";

interface ProductInfoProps {
  name: string;
  price?: number;
  inStock: boolean;
  brand?: string;
  onNavigate: () => void;
}

const formatPrice = (price?: number) =>
  price ? new Intl.NumberFormat("fa-IR").format(price) : null;

export default function ProductInfo({
  name,
  price,
  inStock,
  brand,
  onNavigate,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col grow p-4 sm:px-7 sm:pt-6 sm:pb-8 gap-3 sm:gap-6 bg-white sm:bg-gradient-to-b sm:from-white/90 sm:via-white/95 sm:to-cyan-50/70 relative z-10">
      {/* --- Mobile Layout --- */}
      <div className="sm:hidden space-y-3">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onNavigate}
          title={name}
          className="cursor-pointer font-bold text-base leading-tight text-gray-900 line-clamp-2 hover:text-cyan-700 transition-colors duration-300"
        >
          {name}
        </motion.h3>

        <div className="flex items-center justify-between">
          {brand && (
            <span className="text-xs text-cyan-600 font-semibold bg-cyan-50 px-2 py-1 rounded-md">
              {brand}
            </span>
          )}
          <StockBadge inStock={inStock} isMobile={true} />
        </div>

        {/* Mobile Price (Added based on assumption it should be visible on mobile too, though not in original code explicitly separated like this) */}
        {typeof price === "number" && (
          <div className="text-lg font-bold text-cyan-700 mt-1">
            {formatPrice(price)}{" "}
            <span className="text-xs text-gray-500">تومان</span>
          </div>
        )}
      </div>

      {/* --- Desktop Layout --- */}
      <div className="hidden sm:block">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onNavigate}
          title={name}
          className="
            cursor-pointer font-bold text-lg leading-tight text-gray-900 line-clamp-2
            hover:text-cyan-700 transition-all duration-300
            group-hover:text-transparent group-hover:bg-clip-text
            group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600
          "
        >
          {name}
        </motion.h3>

        <AnimatePresence>
          {typeof price === "number" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="flex items-end gap-2 mt-4"
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="
                  text-3xl font-black text-transparent bg-clip-text
                  bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
                  bg-[length:200%_200%] drop-shadow-lg tracking-tight select-text
                "
              >
                {formatPrice(price)}
              </motion.span>
              <span className="text-sm text-gray-600 font-bold mb-0.5">
                تومان
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4">
          <StockBadge inStock={inStock} isMobile={false} />
        </div>
      </div>
    </div>
  );
}

function StockBadge({
  inStock,
  isMobile,
}: {
  inStock: boolean;
  isMobile: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`
            inline-flex items-center gap-1.5 font-bold rounded-lg border shadow-sm select-none
            ${
              inStock
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }
            ${
              isMobile
                ? "text-xs px-2 py-1"
                : "text-sm px-4 py-2 rounded-xl border-2 shadow-md w-fit"
            }
          `}
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`rounded-full shadow-inner ${
            isMobile ? "w-2 h-2" : "w-3 h-3"
          } ${inStock ? "bg-emerald-500" : "bg-red-500"}`}
        />
        {inStock ? "موجود" : "ناموجود"}
      </motion.span>
    </AnimatePresence>
  );
}
