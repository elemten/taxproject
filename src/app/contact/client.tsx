"use client";

import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { LeadForm } from "@/components/lead-form";
import { easing } from "@/lib/animations";

export function ContactPageClient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <motion.div
          className="space-y-8 lg:col-span-6"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: easing.easeOutExpo }}
        >
          <SectionHeading
            eyebrow="Contact"
            title="Let's make this simple"
            description="Tell us what you need and we'll reply with next steps, timeline guidance, and a tailored checklist."
            level={1}
          />

          <motion.div
            className="surface-solid p-6"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
          >
            <p className="text-sm font-semibold">Contact details</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <motion.li
                className="flex items-center gap-2"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <MapPin className="size-4" aria-hidden="true" />
                <span>{site.locationShort}</span>
              </motion.li>
              <motion.li
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <a
                  className="inline-flex items-center gap-2 link-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={`tel:${site.phoneHref}`}
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {site.phone}
                </a>
              </motion.li>
              <motion.li
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <a
                  className="inline-flex items-center gap-2 link-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={`mailto:${site.email}`}
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {site.email}
                </a>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <Clock className="size-4" aria-hidden="true" />
                <span>{site.hours}</span>
              </motion.li>
            </ul>
          </motion.div>

          <motion.div
            className="surface-solid p-6"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-brand" aria-hidden="true" />
              <p className="text-sm font-semibold">Service area</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Serving Saskatoon and clients across {site.province}, with remote
              support available across Canada.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-6"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: easing.easeOutExpo }}
        >
          <LeadForm
            title="Contact form"
            subtitle="We'll follow up with next steps and a simple checklist."
          />
        </motion.div>
      </div>
    </div>
  );
}
