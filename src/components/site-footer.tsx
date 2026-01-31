import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <SiteLogo variant="icon" />
            <p className="max-w-sm text-sm text-muted-foreground">
              Saskatchewan-focused tax services with a clear process and a
              premium, client-first experience.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:col-span-2">
            <div className="space-y-3">
              <p className="text-sm font-semibold">Services</p>
              <ul className="space-y-2 text-sm">
                {site.serviceLines.map((s) => (
                  <li key={s.href}>
                    <Link className="link-muted" href={s.href}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold">Contact</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4" aria-hidden="true" />
                  <span>{site.locationShort}</span>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 link-muted" href={`tel:${site.phone}`}>
                    <Phone className="size-4" aria-hidden="true" />
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 link-muted" href={`mailto:${site.email}`}>
                    <Mail className="size-4" aria-hidden="true" />
                    {site.email}
                  </a>
                </li>
                <li className="text-xs">
                  <span className="text-muted-foreground">Hours: </span>
                  <span className="text-foreground/90">{site.hours}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            This website is for informational purposes only and does not
            constitute tax, legal, or financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
