"use client";

import { motion } from "framer-motion";

export const AnimatedSection = ({
  children,
  initial = { opacity: 0, y: 20 },
  className = "",
}) => {
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
