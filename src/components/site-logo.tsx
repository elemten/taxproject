import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
  variant = "icon",
  priority,
}: {
  className?: string;
  variant?: "navbar" | "icon";
  priority?: boolean;
}) {
  const isNavbar = variant === "navbar";
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isNavbar ? "gap-3" : "gap-2",
        className,
      )}
      aria-label="TrustEdge Tax Services"
    >
      {isNavbar ? (
        <Image
          src="/assets/navbar.png"
          alt="TrustEdge Saskatchewan Tax Services"
          width={520}
          height={233}
          priority={priority}
          sizes="(max-width: 768px) 220px, 360px"
          className="h-10 w-auto sm:h-11 md:h-12"
        />
      ) : (
        <>
          <Image
            src="/assets/logo.png"
            alt="TrustEdge Tax Services logo"
            width={44}
            height={44}
            priority={priority}
            className="h-10 w-10 object-contain"
          />
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">
              TrustEdge
            </span>
            <span className="block text-xs text-muted-foreground">
              Tax Services
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
