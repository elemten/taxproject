"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { easing } from "@/lib/animations";
import { ImageWithLoader } from "./image-with-loader";

export function ServiceCard({
  title,
  description,
  href,
  icon,
  imageSrc,
  imageAlt,
  ctaLabel,
  className,
}: {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  ctaLabel?: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "group surface-solid ring-1 ring-white/45 overflow-hidden",
        className,
      )}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -8,
              boxShadow: "0 28px 60px -20px rgba(6, 43, 104, 0.25)",
            }
      }
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {imageSrc ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/45 bg-muted">
          <motion.div
            className="absolute inset-0"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.4, ease: easing.easeOutExpo }}
          >
            <ImageWithLoader
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              containerClassName="h-full w-full"
              priority={false}
            />
          </motion.div>
        </div>
      ) : null}

      <div className="space-y-4 p-6">
        {!imageSrc ? (
          <motion.div
            className="inline-flex size-11 items-center justify-center rounded-[--radius-lg] border bg-white/60 text-brand shadow-sm backdrop-blur"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {icon}
          </motion.div>
        ) : null}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        </div>

        <Link
          href={href}
          className={cn(
            "group/btn inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            imageSrc
              ? "bg-brand text-brand-foreground hover:brightness-95"
              : "text-foreground hover:text-foreground/80",
          )}
        >
          <span>{ctaLabel ?? (imageSrc ? "READ MORE" : "Learn more")}</span>
          <motion.span
            className="inline-block"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ArrowRight
              className="size-4"
              aria-hidden="true"
            />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}
