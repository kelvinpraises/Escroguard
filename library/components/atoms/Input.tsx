import { cn } from "@/utils";
import { ChangeEvent, KeyboardEvent } from "react";

interface InputProps {
  type?: "text" | "number" | "textarea" | "tag";
  label?: string;
  disabled?: boolean;
  value: string;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Input = ({ type = "text", label, disabled, value, className, onChange }: InputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (type === "tag") {
      if (e.key === "Backspace" && e.currentTarget.value === "") {
        const newTags = value.trim().split(" ").slice(0, -1).join(" ");
        onChange({ target: { value: newTags } } as ChangeEvent<HTMLInputElement>);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const newTag = e.currentTarget.value.trim();
        if (newTag) {
          const newTags = `${value.trim()} ${newTag}`;
          onChange({ target: { value: newTags } } as ChangeEvent<HTMLInputElement>);
          e.currentTarget.value = "";
        }
      }
    }
  };

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          className={cn("bg-[#1F2329] p-4 rounded-md h-[113px] outline-none", disabled && "bg-white shadow-[0_0_0_2px] shadow-[#4E81FF]", className)}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );
    } else if (type === "tag") {
      const tags = value.split(" ").filter(Boolean);
      return (
        <div className="flex gap-2 flex-wrap p-4 bg-[#4e80ff28] rounded-md">
          {tags.map((tag, index) => (
            <div key={index} className="bg-[#1F2329] rounded-full px-2 text-sm flex items-center">
              <span>{tag}</span>
              <span className="ml-1 cursor-pointer font-bold" onClick={() => {
                const newTags = tags.filter((_, i) => i !== index).join(" ");
                onChange({ target: { value: newTags } } as ChangeEvent<HTMLInputElement>);
              }}>x</span>
            </div>
          ))}
          <input
            type="text"
            className={cn("outline-none bg-transparent flex-1", className)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        </div>
      );
    } else {
      return (
        <input
          type={type}
          className={cn("bg-[#1F2329] p-4 rounded-md outline-none w-full", disabled && "bg-white shadow-[0_0_0_2px] shadow-[#4E81FF]", className)}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full")}>
      {label && <p className="text-sm font-semibold text-[#ffffff]">{label}</p>}
      {renderInput()}
    </div>
  );
};

export default Input;
