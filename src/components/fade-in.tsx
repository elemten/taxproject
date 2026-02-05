"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { Variants } from "framer-motion";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  fadeIn,
  scaleIn,
  staggerContainer,
  viewportSettings,
} from "@/lib/animations";

type AnimationType = "fadeInUp" | "fadeInLeft" | "fadeInRight" | "fadeIn" | "scaleIn" | "stagger";

interface FadeInProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  fadeIn,
  scaleIn,
  stagger: staggerContainer,
};

export function FadeIn({
  children,
  animation = "fadeInUp",
  delay = 0,
  className,
  once = true,
  amount = 0.2,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = animationVariants[animation];

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "-100px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item for use inside FadeIn with stagger animation
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}

// Animated section wrapper
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportSettings}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
