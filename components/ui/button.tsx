"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";

const VARIANT_MAP: Record<ButtonVariant, string> = {
  primary: "c-button--primary",
  secondary: "c-button--secondary",
  ghost: "c-button--ghost",
  icon: "c-button--icon",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      asChild = false,
      isActive = false,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled ?? false;
    const variantClass = VARIANT_MAP[variant];

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "c-button",
          variantClass,
          isActive && "c-button--active",
          isLoading && "c-button--loading",
          isDisabled && "c-button--disabled",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
