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
        <>
          <Image
            src="/assets/newlogo.png"
            alt="TrustEdge Tax Services"
            width={64}
            height={64}
            priority={priority}
            sizes="48px"
            className="h-10 w-10 object-contain sm:h-11 sm:w-11 md:h-12 md:w-12"
          />
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight sm:text-base">
              TrustEdge
            </span>
            <span className="block text-xs text-muted-foreground">
              Tax Services
            </span>
          </span>
        </>
      ) : (
        <>
          <Image
            src="/assets/newlogo.png"
            alt="TrustEdge Tax Services"
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
