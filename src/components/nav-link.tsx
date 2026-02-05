"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { easing } from "@/lib/animations";

export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "text-foreground",
        className
      )}
    >
      <motion.span
        whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {children}
      </motion.span>
      
      {/* Animated underline indicator with glow effect */}
      <motion.span
        className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand"
        initial={false}
        animate={{
          scaleX: isActive ? 1 : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.3,
          ease: easing.easeOutExpo,
        }}
        style={{
          originX: isActive ? 0.5 : 0,
          boxShadow: isActive && !shouldReduceMotion
            ? "0 -2px 8px 2px rgba(255, 255, 255, 0.8), 0 -4px 16px 4px rgba(255, 255, 255, 0.4)"
            : "none",
        }}
      />
    </Link>
  );
}
