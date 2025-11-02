"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  addProduct,
  removeProduct,
  productIsLiked,
} from "@/store/slices/likedPosts";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";

export default function LikeProduct({
  id,
  size = 22,
}: {
  id: string;
  size?: number;
}) {
  const dispatch = useDispatch();
  const state = useSelector((s: RootState) => s);
  const isLiked = productIsLiked(state, id);

  const toggle = () => dispatch(isLiked ? removeProduct(id) : addProduct(id));

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className={`
        relative flex items-center justify-center
        rounded-full p-[clamp(0.5rem,0.7vw,0.65rem)]
        shadow-soft transition-all duration-300
        border border-gray-300/80
        ${
          isLiked
            ? "bg-gradient-to-br from-teal-500 to-cyan-600"
            : "bg-gray-100 hover:bg-gray-200"
        }
      `}
      aria-label="افزودن به علاقه‌مندی‌ها"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLiked ? (
          <motion.span
            key="liked"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FaHeart
              size={size}
              className="text-rose-100 drop-shadow-[0_0_6px_rgba(0,0,0,0.25)]"
            />
          </motion.span>
        ) : (
          <motion.span
            key="unliked"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FaHeart
              size={size}
              className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200"
            />
          </motion.span>
        )}
      </AnimatePresence>

      {/* پالس واضح فقط زمان لایک */}
      {isLiked && (
        <motion.span
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 bg-rose-400/30 rounded-full pointer-events-none"
        />
      )}
    </motion.button>
  );
}
