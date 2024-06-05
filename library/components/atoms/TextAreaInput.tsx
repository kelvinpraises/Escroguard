import { cn } from "@/utils";
import { forwardRef } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disabled, label, ...props }, ref) => (
    <>
      {label && <p className="text-sm font-semibold text-[#ffffff]">{label}</p>}
      <textarea
        className={cn(
          "bg-[#1F2329] p-4 rounded-md h-[113px] outline-none",
          disabled && "bg-white shadow-[0_0_0_2px] shadow-[#4E81FF]",
          className
        )}
        ref={ref}
        {...props}
      />
    </>
  )
);
TextareaInput.displayName = "TextareaInput";

export default TextareaInput;
