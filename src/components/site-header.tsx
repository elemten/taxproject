"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Clock, Phone, Mail, Menu, X } from "lucide-react";
import { site } from "@/lib/site";
import { SiteLogo } from "@/components/site-logo";
import { NavLink } from "@/components/nav-link";
import { staggerFast, fadeIn, easing } from "@/lib/animations";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <motion.header
      className="sticky top-0 z-50"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easing.easeOutExpo }}
    >
      {/* Top Bar */}
      <motion.div
        className="bg-brand text-brand-foreground"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easing.easeOutExpo }}
      >
        <div className="container-page flex flex-col gap-2 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            className="flex flex-wrap items-center gap-x-3 gap-y-1"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" aria-hidden="true" />
              <span className="font-medium">{site.hours}</span>
            </span>
            <span className="text-brand-foreground/80">
              (Closed on public holidays)
            </span>
          </motion.div>
          <motion.div
            className="flex flex-wrap items-center gap-x-4 gap-y-1"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.a
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
              href={`tel:${site.phone}`}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <Phone className="size-4" aria-hidden="true" />
              <span className="font-medium">{site.phone}</span>
            </motion.a>
            <motion.a
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
              href={`mailto:${site.email}`}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <Mail className="size-4" aria-hidden="true" />
              <span className="font-medium">{site.email}</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.div
        className="border-b bg-white/60 backdrop-blur-xl"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="container-page flex items-center justify-between py-3">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: easing.easeOutExpo }}
          >
            <SiteLogo variant="navbar" priority />
          </motion.div>

          <motion.nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main"
            initial={shouldReduceMotion ? { opacity: 1 } : "hidden"}
            animate="visible"
            variants={shouldReduceMotion ? {} : staggerFast}
          >
            {site.nav.map((item, index) => (
              <motion.div
                key={item.href}
                variants={shouldReduceMotion ? {} : fadeIn}
                custom={index}
              >
                <NavLink href={item.href}>{item.title}</NavLink>
              </motion.div>
            ))}
            <motion.div
              variants={shouldReduceMotion ? {} : fadeIn}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <Link
                href="/contact"
                className="ml-2 inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden" ref={mobileMenuRef}>
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full border bg-white/70 p-2 shadow-sm backdrop-blur transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="size-5" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="size-5" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  {/* Backdrop overlay */}
                  <motion.div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setMobileMenuOpen(false)}
                  />

                  {/* Menu content */}
                  <motion.div
                    className="absolute right-0 z-50 mt-2 w-[min(92vw,20rem)] origin-top-right overflow-hidden rounded-[--radius-lg] border bg-white/90 shadow-xl backdrop-blur-xl"
                    initial={{ scale: 0.95, opacity: 0, y: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: easing.easeOutExpo }}
                  >
                    <div className="flex flex-col p-2">
                      {site.nav.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { opacity: 0, x: 20 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.3,
                            ease: easing.easeOutExpo,
                          }}
                        >
                          <Link
                            href={item.href}
                            className="block rounded-[--radius-lg] px-3 py-2 text-sm font-medium transition-colors hover:bg-white/60"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: site.nav.length * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <Link
                          href="/contact"
                          className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm hover:brightness-95"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Contact Us
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
