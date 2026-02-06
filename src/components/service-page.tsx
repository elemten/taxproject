"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { easing, staggerContainer, fadeInUp } from "@/lib/animations";
import { AnimatedAccordion } from "@/components/animated-accordion";
import { ImageWithLoader } from "./image-with-loader";

export type ServiceFaq = { q: string; a: string };

export function ServicePage({
  title,
  intro,
  whoFor,
  included,
  bring,
  faqs,
  imageSrc,
  imageAlt,
}: {
  title: string;
  intro: string;
  whoFor: string[];
  included: string[];
  bring: string[];
  faqs: ServiceFaq[];
  imageSrc?: string;
  imageAlt?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-10">
        <motion.div
          className="space-y-4"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: easing.easeOutExpo }}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Services
          </motion.p>
          <motion.h1
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6, ease: easing.easeOutExpo }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="max-w-3xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {intro}
          </motion.p>
          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
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
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-brand/25 bg-white/75 px-6 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Contact us
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {imageSrc ? (
          <motion.div
            className="surface-solid overflow-hidden"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: easing.easeOutExpo }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
          >
            <div className="relative aspect-[16/7] w-full bg-muted overflow-hidden">
              <motion.div
                className="absolute inset-0"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                transition={{ duration: 0.6, ease: easing.easeOutExpo }}
              >
                <ImageWithLoader
                  src={imageSrc}
                  alt={imageAlt ?? `${title} service photo`}
                  fill
                  containerClassName="h-full w-full"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-5"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: easing.easeOutExpo }}
          >
            <Card>
              <h2 className="text-lg font-semibold tracking-tight">
                Who this is for
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {whoFor.map((item, index) => (
                  <motion.li
                    key={item}
                    className="flex gap-3"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 text-brand"
                      aria-hidden="true"
                    />
                    <span className="leading-7">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: easing.easeOutExpo }}
          >
            <Card>
              <h2 className="text-lg font-semibold tracking-tight">
                What&apos;s included
              </h2>
              <motion.div
                className="mt-4 grid gap-3 sm:grid-cols-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={shouldReduceMotion ? {} : staggerContainer}
              >
                {included.map((item, index) => (
                  <motion.div
                    key={item}
                    variants={shouldReduceMotion ? {} : fadeInUp}
                    custom={index}
                    className="surface p-4 text-sm text-muted-foreground"
                    whileHover={shouldReduceMotion ? {} : { y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <p className="font-medium text-foreground/90">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: easing.easeOutExpo }}
          >
            <Card>
              <h2 className="text-lg font-semibold tracking-tight">
                What to bring
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                A simple starting checklist. We&apos;ll confirm anything specific
                during the consultation.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {bring.map((item, index) => (
                  <motion.li
                    key={item}
                    className="flex gap-3"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 text-brand"
                      aria-hidden="true"
                    />
                    <span className="leading-7">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: easing.easeOutExpo }}
          >
            <Card>
              <h2 className="text-lg font-semibold tracking-tight">FAQs</h2>
              <div className="mt-4">
                <AnimatedAccordion items={faqs} />
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="surface-solid p-8 sm:p-10"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: easing.easeOutExpo }}
          whileHover={shouldReduceMotion ? {} : { y: -4 }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold tracking-tight">
                Ready to get started?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Book a consultation and we&apos;ll confirm next steps.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Link
                href="/#book"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Book now
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("surface-solid p-6", className)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
