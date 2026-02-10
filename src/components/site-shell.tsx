"use client";

import { usePathname } from "next/navigation";
import { AmbientBackground } from "@/components/ambient-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  return (
    <div className="relative min-h-dvh bg-background">
      {!isAdminRoute ? <AmbientBackground /> : null}
      <div className="relative z-10">
        {!isAdminRoute ? <SiteHeader /> : null}
        <main>{children}</main>
        {!isAdminRoute ? <SiteFooter /> : null}
      </div>
    </div>
  );
}
