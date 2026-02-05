import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

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
  return (
    <div
      className={cn(
        "group surface-solid ring-1 ring-white/45 transition-all hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      {imageSrc ? (
        <div className="relative aspect-[16/9] w-full border-b border-white/45 bg-muted">
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      ) : null}

      <div className="space-y-4 p-6">
        {!imageSrc ? (
          <div className="inline-flex size-11 items-center justify-center rounded-[--radius-lg] border bg-white/60 text-brand shadow-sm backdrop-blur">
            {icon}
          </div>
        ) : null}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        </div>

        <Link
          href={href}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            imageSrc
              ? "bg-brand text-brand-foreground hover:brightness-95"
              : "text-foreground hover:text-foreground/80",
          )}
        >
          {ctaLabel ?? (imageSrc ? "READ MORE" : "Learn more")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
