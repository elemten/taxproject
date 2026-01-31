import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em]",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-white/80 text-muted-foreground",
        brand:
          "border border-brand/30 bg-brand/10 text-brand",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
