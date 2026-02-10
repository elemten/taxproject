"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { ServiceCard } from "@/components/service-card";
import { TeamCard } from "@/components/team-card";
import { BookingConsultationCard } from "@/components/booking-consultation-card";
import { easing, staggerContainer } from "@/lib/animations";

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-background">
        <div className="relative h-[560px] w-full overflow-hidden">
          <Image
            src="/images/site/hero-saskatoon.webp"
            alt="Saskatoon, Saskatchewan winter morning skyline"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/45 to-transparent" />
          {/* Subtle pattern/texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--brand-rgb),0.06),transparent_55%)]" />

          <div className="relative h-full">
            <div className="container-page grid h-full items-center gap-10 lg:grid-cols-12">
              <div className="max-w-2xl space-y-5 lg:col-span-7">
                <motion.p
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-brand"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: easing.easeOutExpo }}
                >
                  Expert tax services
                </motion.p>
                <motion.h1
                  className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: easing.easeOutExpo }}
                >
                  Accurate & reliable tax filing for {site.locationShort}
                </motion.h1>
                <motion.p
                  className="max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: easing.easeOutExpo }}
                >
                  Personal tax, corporate tax, and estate planning services —
                  with a clear checklist, careful review, and calm communication.
                </motion.p>
                <motion.div
                  className="space-y-3"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: easing.easeOutExpo }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Link
                        href="/contact"
                        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        CONTACT US
                      </Link>
                    </motion.div>
                    <motion.a
                      href={`tel:${site.phoneHref}`}
                      className="inline-flex h-11 w-full items-center justify-center rounded-full border border-brand/25 bg-white/75 px-3 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      Call {site.phone}
                    </motion.a>
                  </div>
                  <motion.div
                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Link
                      href="/#book"
                      className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-r from-brand via-[#17499a] to-brand px-5 text-sm font-semibold text-brand-foreground shadow-lg transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-sm transition-all duration-500 group-hover:left-full group-hover:opacity-100" />
                      Tap to Book a Free Consultation
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              <div className="hidden lg:block lg:col-span-5 lg:justify-self-end">
                <BookingConsultationCard className="shadow-2xl lg:h-[500px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        className="bg-background"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-page py-14 sm:py-20">
          <div className="space-y-10">
            <motion.div
              className="space-y-3"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easing.easeOutExpo }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Our services
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Focused solutions for individuals, businesses, and families
              </h2>
            </motion.div>

            <motion.div
              className="grid gap-6 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={shouldReduceMotion ? {} : staggerContainer}
            >
              <ServiceCard
                title="Personal Tax"
                description="Clean, checklist-driven filing with a calm, professional experience built for Saskatchewan clients."
                href="/services/personal-tax"
                imageSrc="/images/site/personal-tax-card-20260206.png"
                imageAlt="Personal tax preparation desk scene in Saskatchewan"
                ctaLabel="READ MORE"
              />
              <ServiceCard
                title="Corporate Tax"
                description="A structured workflow to keep business documents organized, review-ready, and CRA-ready."
                href="/services/corporate-tax"
                imageSrc="/images/site/corporate-tax-4k.webp"
                imageAlt="Modern corporate desk scene for tax planning"
                ctaLabel="READ MORE"
              />
              <ServiceCard
                title="Estate Planning"
                description="Professional handling and coordination for estate-related tax needs with clear next steps."
                href="/services/estate-planning"
                imageSrc="/images/site/estate-planning-4k.webp"
                imageAlt="Calm estate planning desk scene with binder and documents"
                ctaLabel="READ MORE"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Our expertise in finance and taxation
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Get to know about <span className="text-brand">our company</span>
              </h2>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                At TrustEdge Tax Services, we focus on personal tax, corporate
                tax, and estate planning services — delivered with a clear,
                premium process.
              </p>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                We keep the workflow simple: checklist, preparation, review, and
                a clear next step. Built for Saskatoon and Saskatchewan clients.
              </p>
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
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
                Meet <span className="text-brand">{site.personName}</span>
              </h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Your point of contact at TrustEdge
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

      {/* Booking Section */}
      <section id="book" className="bg-background">
        <div className="container-page py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <motion.div
              className="space-y-4 lg:col-span-6"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: easing.easeOutExpo }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Book a consultation
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Request an appointment
              </h2>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Request your consultation by phone or contact form and we&apos;ll
                confirm the next step quickly with a clear checklist and timing.
              </p>
              <motion.div
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  Call {site.phone}
                </motion.a>
                <motion.div
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Link
                    href="/contact"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-brand/25 bg-white/75 px-6 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Contact form
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:col-span-6"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: easing.easeOutExpo }}
            >
              <BookingConsultationCard />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
