import { cn } from "@/utils";
import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, label, ...props }, ref) => (
    <>
      {label && <p className="text-sm font-semibold text-[#ffffff]">{label}</p>}
      <input
        type={type}
        className={cn(
          "bg-[#1F2329] p-4 rounded-md outline-none w-full",
          disabled && "bg-white shadow-[0_0_0_2px] shadow-[#4E81FF]",
          className
        )}
        ref={ref}
        {...props}
      />
    </>
  )
);
Input.displayName = "Input";

export default Input;
