import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-navy-light",
        /* Navy button with gold hover glow — main CTA */
        hero: "bg-navy text-primary-foreground border border-glass-border shadow-card hover:border-gold hover:shadow-glow-gold hover:scale-[1.03] active:scale-[0.98] font-display tracking-[0.18em] uppercase",
        /* Solid gold button — submit / celebrate */
        gold: "bg-gold text-accent-foreground shadow-glow-gold-soft hover:bg-gold-light hover:shadow-glow-gold hover:scale-[1.03] active:scale-[0.98] font-display tracking-[0.18em] uppercase",
        /* Translucent glass button — secondary / back */
        glass:
          "glass text-foreground hover:border-gold/60 hover:bg-glass/50 font-display tracking-[0.18em] uppercase",
        success:
          "bg-success text-primary-foreground hover:bg-success-light shadow-glow-green font-display tracking-[0.18em] uppercase",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-glass hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-glass hover:text-foreground",
        link: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-sm",
        xl: "h-14 rounded-2xl px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
