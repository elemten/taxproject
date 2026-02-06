"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { easing, staggerContainer, fadeInUp } from "@/lib/animations";
import { ImageWithLoader } from "@/components/image-with-loader";

export function ServicesPageClient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <motion.div
          className="space-y-6 lg:col-span-4"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: easing.easeOutExpo }}
        >
          <div className="space-y-3">
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Our services
            </motion.p>
            <motion.h1
              className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6, ease: easing.easeOutExpo }}
            >
              What we offer
            </motion.h1>
            <motion.p
              className="text-sm leading-7 text-muted-foreground sm:text-base"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Focused support for Saskatoon and Saskatchewan clients.
            </motion.p>
          </div>

          <motion.div
            className="space-y-3"
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
                  className="group flex items-center justify-between rounded-full bg-brand px-6 py-5 text-base font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{s.title}</span>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-8"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: easing.easeOutExpo }}
        >
          <motion.div
            className="surface-solid overflow-hidden"
            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
              <motion.div
                className="absolute inset-0"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                transition={{ duration: 0.6, ease: easing.easeOutExpo }}
              >
                <ImageWithLoader
                  src="/images/site/services-overview.webp"
                  alt="Modern, minimal office interior representing tax service options"
                  fill
                  containerClassName="h-full w-full"
                  priority
                />
              </motion.div>
            </div>
            <motion.div
              className="p-8 sm:p-10"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Saskatoon • {site.province}
              </p>
              <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                A simple, premium process — built around clarity
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                We keep every engagement organized and predictable. Start with a
                checklist, then preparation, a review step, and clear next
                actions. If you&apos;re unsure what service you need, we can guide
                you in a quick consultation.
              </p>
              <motion.div
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
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
                    href="/contact"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    CONTACT US
                  </Link>
                </motion.div>
                <motion.a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-brand/25 bg-white/75 px-6 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  Call {site.phone}
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
