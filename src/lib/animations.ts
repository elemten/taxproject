import { Variants, Transition } from "framer-motion";

// Premium easing curves
export const easing = {
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeInOutExpo: [0.87, 0, 0.13, 1] as const,
  easeOutBack: [0.34, 1.56, 0.64, 1] as const,
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
};

// Default transition settings
export const defaultTransition: Transition = {
  duration: 0.6,
  ease: easing.easeOutExpo,
};

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Simple fade in
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing.easeOutExpo,
    },
  },
};

// Scale up fade in
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
};

// Stagger container for children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger with faster timing
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Slide down (for header, etc)
export const slideDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing.easeOutExpo,
    },
  },
};

// Card hover effect
export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  },
};

// Button tap effect
export const buttonTap = {
  scale: 0.98,
};

// Button hover effect
export const buttonHover = {
  scale: 1.02,
  transition: {
    type: "spring",
    stiffness: 500,
    damping: 30,
  },
};

// Accordion content animation
export const accordionContent: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: easing.easeOutQuart,
      },
      opacity: {
        duration: 0.25,
        delay: 0.1,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: easing.easeInOutExpo,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

// Floating animation for ambient elements
export const floatingAnimation = {
  y: [0, -20, 0],
  x: [0, 10, 0],
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  },
};

// Pulsing opacity
export const pulseOpacity = {
  opacity: [0.3, 0.5, 0.3],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Viewport settings for scroll-triggered animations
export const viewportSettings = {
  once: true,
  margin: "-100px" as const,
  amount: 0.2,
};

// Hero specific animations
export const heroTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: easing.easeOutExpo,
    },
  }),
};

// Image reveal animation
export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easing.easeOutExpo,
    },
  },
};

// Nav link indicator animation
export const navIndicator: Variants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easing.easeOutExpo,
    },
  },
};
