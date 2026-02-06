"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Skeleton loader with shimmer effect */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Actual image with blur-up effect */}
      <div
        className="h-full w-full"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "scale(1)" : "scale(1.05)",
          filter: isLoaded ? "blur(0px)" : "blur(10px)",
          transition: "opacity 0.45s ease, transform 0.45s ease, filter 0.45s ease",
        }}
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
      </div>
    </div>
  );
}
