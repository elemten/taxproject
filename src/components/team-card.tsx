"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easing } from "@/lib/animations";

export function TeamCard({
  name,
  role,
  points,
  className,
}: {
  name: string;
  role: string;
  points: string[];
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <motion.div
      className={cn("surface-solid p-8", className)}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: easing.easeOutExpo }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="grid size-12 place-items-center rounded-full border bg-muted text-sm font-semibold"
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {initials || "TE"}
        </motion.div>
        <div>
          <p className="text-lg font-semibold tracking-tight">{name}</p>
          <p className="text-sm font-semibold text-brand">{role}</p>
        </div>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
        {points.map((p, index) => (
          <motion.li
            key={p}
            className="leading-7"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
              ease: easing.easeOutExpo,
            }}
          >
            {p}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
