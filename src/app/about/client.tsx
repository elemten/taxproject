"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { TeamCard } from "@/components/team-card";
import { easing } from "@/lib/animations";

export function AboutPageClient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <section className="bg-background">
        <div className="container-page py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <motion.div
              className="space-y-6 lg:col-span-6"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: easing.easeOutExpo }}
            >
              <motion.p
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Our expertise in finance and taxation
              </motion.p>
              <motion.h1
                className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.6, ease: easing.easeOutExpo }}
              >
                Get to know about <span className="text-brand">our company</span>
              </motion.h1>
              <motion.p
                className="text-sm leading-7 text-muted-foreground sm:text-base"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                TrustEdge Tax Services focuses on personal tax, corporate tax,
                and estate planning services for Saskatchewan clients —
                delivered with a calm, checklist-driven process.
              </motion.p>
              <motion.p
                className="text-sm leading-7 text-muted-foreground sm:text-base"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                This site is a mockup to approve layout, content flow, and a
                premium minimal look before connecting any backend systems.
              </motion.p>
              <motion.div
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
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
                  href={`tel:${site.phone}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-brand/25 bg-white/75 px-6 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  Call {site.phone}
                </motion.a>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:col-span-6"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: easing.easeOutExpo }}
            >
              <motion.div
                className="surface-solid overflow-hidden"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="relative aspect-[3/2] w-full bg-muted overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    transition={{ duration: 0.6, ease: easing.easeOutExpo }}
                  >
                    <Image
                      src="/images/site/about-office.webp"
                      alt="Clean modern workspace representing TrustEdge Tax Services"
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-14 sm:py-20">
          <motion.div
            className="space-y-10"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easing.easeOutExpo }}
            >
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Who you&apos;ll work with
              </h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                A single, consistent point of contact
              </p>
            </motion.div>

            <motion.div
              className="mx-auto w-full max-w-md"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: easing.easeOutExpo }}
            >
              <TeamCard
                name={site.personName}
                role="Tax Professional"
                points={[
                  "Client coordination and filing support",
                  "Saskatchewan-focused workflow",
                  "Clear checklist-driven process",
                ]}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
