import { type VariantProps } from "class-variance-authority";
import React from "react";
import { useFormStatus } from "react-dom";

import { Button, buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, asChild = false, ...props }, ref) => {
    const { pending } = useFormStatus();
    return (
      <Button
        aria-disabled={pending}
        type="submit"
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {children}
      </Button>
    );
  }
);

export default SubmitButton;
