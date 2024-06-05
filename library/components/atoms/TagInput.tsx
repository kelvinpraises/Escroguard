import { cn } from "@/utils";
import React, { ChangeEvent, KeyboardEvent, forwardRef } from "react";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  disabled?: boolean;
  value: string;
  label?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TagInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, type, value, onChange, disabled, label, ...props }, ref) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && e.currentTarget.value === "") {
        const newTags = value.trim().split(" ").slice(0, -1).join(" ");
        onChange({
          target: { value: newTags },
        } as ChangeEvent<HTMLInputElement>);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const newTag = e.currentTarget.value.trim();
        if (newTag) {
          const newTags = `${value.trim()} ${newTag}`;
          onChange({
            target: { value: newTags },
          } as ChangeEvent<HTMLInputElement>);
          e.currentTarget.value = "";
        }
      }
    };

    const tags = value.split(" ").filter(Boolean);

    return (
      <>
        {label && (
          <p className="text-sm font-semibold text-[#ffffff]">{label}</p>
        )}
        <div className="flex gap-2 flex-wrap p-4 bg-[#4e80ff28] rounded-md">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-[#1F2329] rounded-full px-2 text-sm flex items-center"
            >
              <span>{tag}</span>
              <span
                className="ml-1 cursor-pointer font-bold"
                onClick={() => {
                  const newTags = tags.filter((_, i) => i !== index).join(" ");
                  onChange({
                    target: { value: newTags },
                  } as ChangeEvent<HTMLInputElement>);
                }}
              >
                x
              </span>
            </div>
          ))}
          <input
            type="text"
            className={cn("outline-none bg-transparent flex-1", className)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            ref={ref}
            {...props}
          />
        </div>
      </>
    );
  }
);
TagInput.displayName = "TagInput";

export default TagInput;
