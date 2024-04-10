'use client';

import { motion } from 'framer-motion';
import React from 'react';

export const Reveal: React.FC<RevealProps> = ({ children, duration = 0.5 }) => {
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: duration } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
