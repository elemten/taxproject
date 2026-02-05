"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { easing } from "@/lib/animations";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
}

export function ImageWithLoader({
  src,
  alt,
  fill,
  width,
  height,
  className,
  containerClassName,
  priority = false,
  sizes,
}: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Skeleton loader with shimmer effect */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-muted"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      )}

      {/* Actual image with blur-up effect */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05,
          filter: isLoaded ? "blur(0px)" : "blur(10px)",
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.6,
          ease: easing.easeOutExpo,
        }}
        className="h-full w-full"
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={cn("object-cover", className)}
            onLoad={() => setIsLoaded(true)}
            priority={priority}
            sizes={sizes}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn("object-cover", className)}
            onLoad={() => setIsLoaded(true)}
            priority={priority}
          />
        )}
      </motion.div>
    </div>
  );
}
