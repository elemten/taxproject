"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { easing } from "@/lib/animations";

interface AnimatedAccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export function AnimatedAccordionItem({
  question,
  answer,
  defaultOpen = false,
  className,
}: AnimatedAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("surface-solid overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/40"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-sm font-semibold">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: easing.easeOutExpo }}
        >
          <ChevronDown className="size-5 shrink-0 text-muted-foreground" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: easing.easeOutQuart },
              opacity: { duration: 0.25, delay: shouldReduceMotion ? 0 : 0.05 },
            }}
          >
            <div className="border-t border-border/50 px-5 pb-4 pt-2">
              <p className="text-sm leading-7 text-muted-foreground">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedAccordionProps {
  items: Array<{ q: string; a: string }>;
  className?: string;
}

export function AnimatedAccordion({ items, className }: AnimatedAccordionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <motion.div
          key={item.q}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            delay: shouldReduceMotion ? 0 : index * 0.1,
            duration: 0.5,
            ease: easing.easeOutExpo,
          }}
        >
          <AnimatedAccordionItem
            question={item.q}
            answer={item.a}
            defaultOpen={index === 0}
          />
        </motion.div>
      ))}
    </div>
  );
}
