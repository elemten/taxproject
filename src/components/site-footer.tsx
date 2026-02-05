"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { SiteLogo } from "@/components/site-logo";
import { easing, staggerFast, fadeIn } from "@/lib/animations";

export function SiteFooter() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.footer
      className="border-t bg-brand text-brand-foreground"
      style={{
        ["--muted-foreground" as never]: "rgba(255,255,255,0.78)",
        ["--border" as never]: "rgba(255,255,255,0.16)",
        ["--ring" as never]: "rgba(255,255,255,0.30)",
      }}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: easing.easeOutExpo }}
    >
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <motion.div
            className="space-y-4"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, ease: easing.easeOutExpo }}
          >
            <SiteLogo variant="icon" />
            <p className="max-w-sm text-sm text-muted-foreground">
              Saskatchewan-focused tax services with a clear process and a
              premium, client-first experience.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 sm:grid-cols-2 md:col-span-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={shouldReduceMotion ? {} : staggerFast}
          >
            <motion.div
              className="space-y-3"
              variants={shouldReduceMotion ? {} : fadeIn}
            >
              <p className="text-sm font-semibold">Services</p>
              <ul className="space-y-2 text-sm">
                {site.serviceLines.map((s, index) => (
                  <motion.li
                    key={s.href}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <Link className="link-muted hover:text-foreground transition-colors" href={s.href}>
                      {s.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="space-y-3"
              variants={shouldReduceMotion ? {} : fadeIn}
            >
              <p className="text-sm font-semibold">Contact</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <motion.li
                  className="flex items-center gap-2"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <MapPin className="size-4" aria-hidden="true" />
                  <span>{site.locationShort}</span>
                </motion.li>
                <motion.li
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <a className="inline-flex items-center gap-2 link-muted hover:text-foreground transition-colors" href={`tel:${site.phone}`}>
                    <Phone className="size-4" aria-hidden="true" />
                    {site.phone}
                  </a>
                </motion.li>
                <motion.li
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <a className="inline-flex items-center gap-2 link-muted hover:text-foreground transition-colors" href={`mailto:${site.email}`}>
                    <Mail className="size-4" aria-hidden="true" />
                    {site.email}
                  </a>
                </motion.li>
                <motion.li
                  className="text-xs"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  <span className="text-muted-foreground">Hours: </span>
                  <span className="text-foreground/90">{site.hours}</span>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 flex flex-col gap-3 border-t pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            This website is for informational purposes only and does not
            constitute tax, legal, or financial advice.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
