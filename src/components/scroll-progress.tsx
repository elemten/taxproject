"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  // Smooth spring animation for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Only show progress bar after scrolling a bit
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setIsVisible(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-brand"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}
