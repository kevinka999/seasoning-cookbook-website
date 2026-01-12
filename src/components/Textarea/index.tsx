import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import "./index.css";

type TextareaProps = React.ComponentPropsWithoutRef<"textarea"> & {
  className?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    const baseStyles =
      "bg-[#8b8b8b] text-white minecraft-text-shadow font-minecraft rounded-none outline-none minecraft-input resize-none";
    const innerBorderStyles =
      "shadow-[inset_0_2px_0_0_#373737,inset_2px_0_0_0_#373737,inset_-2px_0_0_0_#ffffff,inset_0_-2px_0_0_#ffffff]";

    const textareaStyles = twMerge(
      baseStyles,
      innerBorderStyles,
      "px-3 py-2 min-h-[120px]",
      className,
    );

    return <textarea ref={ref} className={textareaStyles} {...props} />;
  }
);

Textarea.displayName = "Textarea";

