"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easing } from "@/lib/animations";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  level = 2,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  level?: 1 | 2 | 3;
}) {
  const shouldReduceMotion = useReducedMotion();
  const HeadingTag = `h${level}` as "h1" | "h2" | "h3";

  return (
    <motion.div
      className={cn(
        "space-y-2",
        align === "center" && "text-center",
        className
      )}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: easing.easeOutExpo }}
    >
      {eyebrow ? (
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: align === "center" ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease: easing.easeOutExpo }}
        >
          {eyebrow}
        </motion.p>
      ) : null}
      <HeadingTag className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </HeadingTag>
      {description ? (
        <motion.p
          className="max-w-2xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
