"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  addProduct,
  removeProduct,
  productIsLiked,
} from "@/store/slices/likedPosts";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart } from "react-icons/fi";

interface Props {
  id: string;
  size?: number;
  className?: string;
}

export default function LikeButton({ id, size = 18, className = "" }: Props) {
  const dispatch = useDispatch();
  const state = useSelector((s: RootState) => s.likedPosts);
  const isLiked = productIsLiked(state, id);

  const toggle = () => dispatch(isLiked ? removeProduct(id) : addProduct(id));

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.6, 1] }}
      className={`relative flex items-center justify-center h-10 w-10 rounded-md
                  border border-gray-300 bg-white/90 backdrop-blur-sm 
                  hover:border-cyan-400 hover:bg-white transition-colors
                  ${className}`}
      aria-label="Toggle like"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLiked ? "liked" : "unliked"}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.18, ease: [0.42, 0, 0.58, 1] }}
        >
          <FiHeart
            size={size}
            className={`transition-colors duration-200 ${
              isLiked ? "text-cyan-500 fill-cyan-400" : "text-gray-500"
            }`}
          />
        </motion.span>
      </AnimatePresence>

      {/* Pulse flash when liked */}
      {isLiked && (
        <motion.div
          initial={{ scale: 1, opacity: 0.25 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 rounded-md bg-cyan-400/40 pointer-events-none"
        />
      )}
    </motion.button>
  );
}
