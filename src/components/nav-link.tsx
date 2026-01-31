"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

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
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "text-foreground",
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand opacity-0 transition-opacity",
          isActive && "opacity-100",
        )}
      />
    </Link>
  );
}
