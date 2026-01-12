import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import "./index.css";

type SelectProps = React.ComponentPropsWithoutRef<"select"> & {
  className?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", ...props }, ref) => {
    const baseStyles =
      "bg-[#8b8b8b] text-white minecraft-text-shadow font-minecraft rounded-none outline-none minecraft-select";
    const innerBorderStyles =
      "shadow-[inset_0_2px_0_0_#373737,inset_2px_0_0_0_#373737,inset_-2px_0_0_0_#ffffff,inset_0_-2px_0_0_#ffffff]";

    const selectStyles = twMerge(
      baseStyles,
      innerBorderStyles,
      "px-3 py-2 cursor-pointer",
      className,
    );

    return (
      <select ref={ref} className={selectStyles} {...props}>
        {props.children}
      </select>
    );
  },
);

Select.displayName = "Select";
