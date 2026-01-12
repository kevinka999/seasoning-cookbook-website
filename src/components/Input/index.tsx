import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import "./index.css";

type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    const baseStyles =
      "bg-[#8b8b8b] text-white minecraft-text-shadow font-minecraft rounded-none outline-none minecraft-input";
    const innerBorderStyles =
      "shadow-[inset_0_2px_0_0_#373737,inset_2px_0_0_0_#373737,inset_-2px_0_0_0_#ffffff,inset_0_-2px_0_0_#ffffff]";

    const inputStyles = twMerge(
      baseStyles,
      innerBorderStyles,
      "px-3 py-2",
      className,
    );

    return <input ref={ref} className={inputStyles} {...props} />;
  }
);

Input.displayName = "Input";
