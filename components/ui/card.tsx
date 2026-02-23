"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const VARIANT_MAP = {
  default: "",
  elevated: "c-card--elevated",
  outlined: "c-card--outlined",
  active: "c-card--active",
  locked: "c-card--locked",
  completed: "c-card--completed",
} as const;

export type CardVariant = keyof typeof VARIANT_MAP;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClass = variant === "default" ? "" : VARIANT_MAP[variant];
    return (
      <div
        ref={ref}
        className={cn("c-card", variantClass && variantClass, className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
