"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-nunito font-bold text-button-label rounded-2xl min-h-interactive px-8 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-golden focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-golden text-slate-text hover:opacity-90",
        secondary: "bg-blue-active text-white hover:opacity-90",
        ghost: "bg-transparent text-slate-text hover:bg-slate-200/50",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(() => {
      const t = setTimeout(() => setIsReady(true), 300);
      return () => clearTimeout(t);
    }, []);

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, className }),
          !isReady && "pointer-events-none"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
