"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";
import { easing, staggerContainer, fadeInUp } from "@/lib/animations";

export function SaskatoonTaxServicesPageClient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <motion.div
          className="space-y-6 lg:col-span-7"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: easing.easeOutExpo }}
        >
          <SectionHeading
            eyebrow="Local Service"
            title="Saskatoon tax services with a premium, checklist-driven process"
            description="TrustEdge Tax Services is built for Saskatchewan clients who want clarity, calm communication, and an organized workflow."
          />

          <motion.div
            className="surface-solid p-6"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-brand" aria-hidden="true" />
              <span>Saskatoon, SK</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Serving Saskatoon and clients across {site.province}. Canada-only.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p>
              If you&apos;re looking for Saskatoon tax services, you likely want two
              things: clear requirements and an easy process. We structure every
              engagement around a simple checklist and a review step before
              filing.
            </p>
            <p>
              Our focus areas are personal tax, corporate tax, and estate
              planning services. If you&apos;re unsure what fits, a short consult
              can clarify the next step.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Link
                href="/#book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Book a consultation
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore services
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.aside
          className="lg:col-span-5"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: easing.easeOutExpo }}
        >
          <motion.div
            className="surface-solid p-8"
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <p className="text-sm font-semibold">Quick links</p>
            <motion.div
              className="mt-4 space-y-2 text-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={shouldReduceMotion ? {} : staggerContainer}
            >
              {site.serviceLines.map((s, index) => (
                <motion.div
                  key={s.href}
                  variants={shouldReduceMotion ? {} : fadeInUp}
                  custom={index}
                  whileHover={shouldReduceMotion ? {} : { x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    href={s.href}
                    className="group flex items-center justify-between rounded-[--radius-lg] border bg-white/65 px-4 py-3 shadow-sm backdrop-blur transition-colors hover:bg-white/80"
                  >
                    <span className="font-medium">{s.title}</span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.aside>
      </div>
    </div>
  );
}
