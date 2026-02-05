import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-brand-foreground shadow-sm hover:brightness-95 hover:-translate-y-0.5",
        secondary:
          "bg-brand text-brand-foreground shadow-sm hover:brightness-95",
        outline:
          "border border-brand bg-transparent text-brand hover:bg-brand hover:text-brand-foreground hover:brightness-95",
        ghost: "text-foreground hover:text-foreground/80",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-6 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

export function Button({
  className,
  variant,
  size,
  href,
  children,
  type = "button",
  disabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={classes} 
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  );
}
