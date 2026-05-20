import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl active:scale-97 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-bg-base hover:opacity-90 font-semibold shadow-[0_0_12px_rgba(0,200,212,0.15)]",
        secondary:
          "bg-bg-elevated text-text-primary border border-border-default hover:bg-bg-subtle hover:border-border-subtle shadow-sm",
        outline:
          "bg-transparent text-text-secondary border border-border-default hover:border-border-subtle hover:text-text-primary hover:bg-bg-surface",
        ghost:
          "text-text-secondary hover:bg-bg-surface hover:text-text-primary",
        link:
          "text-text-brand underline-offset-4 hover:underline",
        ai:
          "bg-accent-ai text-text-primary font-semibold hover:opacity-90 shadow-[0_0_12px_rgba(100,87,249,0.25)] border border-accent-ai/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 rounded-lg text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
