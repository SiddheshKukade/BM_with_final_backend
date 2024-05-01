import * as React from "react";
import { styled } from "@/stitches";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = styled("input", {});
const autoComplete = {
  autoComplete: "off",
  autoCorrect: "off",
  "data-form-type": "other",
  spellCheck: false,
};
const TransInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <StyledInput
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
          "bg-transparent",
        )}
        ref={ref}
        {...props}
        {...autoComplete}
      />
    );
  },
);
TransInput.displayName = "TransInput";

export { TransInput };
