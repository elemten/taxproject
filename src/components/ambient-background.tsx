"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AmbientBackgroundProps {
  className?: string;
}

export function AmbientBackground({ className }: AmbientBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Orb 1 - Top left, brand blue */}
      <motion.div
        className="ambient-orb bg-brand/10"
        style={{
          width: 600,
          height: 600,
          top: "-200px",
          left: "-200px",
        }}
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Orb 2 - Bottom right, brand blue with less opacity */}
      <motion.div
        className="ambient-orb bg-brand/5"
        style={{
          width: 500,
          height: 500,
          bottom: "-150px",
          right: "-150px",
        }}
        animate={{
          y: [0, -25, 0],
          x: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
      />

      {/* Orb 3 - Center right, subtle */}
      <motion.div
        className="ambient-orb bg-brand/5"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          right: "10%",
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  );
}
