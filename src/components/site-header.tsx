import Link from "next/link";
import { Clock, Phone, Mail, Menu } from "lucide-react";
import { site } from "@/lib/site";
import { SiteLogo } from "@/components/site-logo";
import { NavLink } from "@/components/nav-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-brand text-brand-foreground">
        <div className="container-page flex flex-col gap-2 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" aria-hidden="true" />
              <span className="font-medium">{site.hours}</span>
            </span>
            <span className="text-brand-foreground/80">(Closed on public holidays)</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a className="inline-flex items-center gap-2 hover:opacity-90" href={`tel:${site.phone}`}>
              <Phone className="size-4" aria-hidden="true" />
              <span className="font-medium">{site.phone}</span>
            </a>
            <a className="inline-flex items-center gap-2 hover:opacity-90" href={`mailto:${site.email}`}>
              <Mail className="size-4" aria-hidden="true" />
              <span className="font-medium">{site.email}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-b bg-white">
        <div className="container-page flex items-center justify-between py-3">
          <SiteLogo variant="navbar" priority />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {site.nav.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.title}
              </NavLink>
            ))}
            <Link
              href="/contact"
              className="ml-2 inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact Us
            </Link>
          </nav>

          <details className="group relative md:hidden">
            <summary className="list-none rounded-full border bg-white p-2 shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Menu className="size-5" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </summary>
            <div className="absolute right-0 mt-2 w-[min(92vw,20rem)] overflow-hidden rounded-[--radius-lg] border bg-white shadow-lg">
              <div className="flex flex-col p-2">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[--radius-md] px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-[--radius-md] bg-brand px-4 text-sm font-semibold text-brand-foreground hover:brightness-95"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
