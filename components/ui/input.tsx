"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isActive?: boolean;
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      isActive = false,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled ?? false;

    return (
      <div className="c-input">
        <input
          ref={ref}
          className={cn(
            "c-input__field",
            isActive && "c-input__field--active",
            isDisabled && "c-input__field--disabled",
            isLoading && "c-input__field--loading",
            className
          )}
          disabled={isDisabled}
          aria-busy={isLoading}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
