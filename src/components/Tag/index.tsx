import { twMerge } from "tailwind-merge";

type TagProps = React.ComponentPropsWithoutRef<"span"> & {
  text: string;
  className?: string;
};

export const Tag = ({ text, className = "", ...props }: TagProps) => {
  const baseStyles =
    "inline-block border-2 border-black rounded-none text-white minecraft-text-shadow font-minecraft bg-[#6f6f6f]";
  const innerBorderStyles =
    "shadow-[inset_0_2px_0_0_#aaaaaa,inset_2px_0_0_0_#aaaaaa,inset_-2px_0_0_0_#565656,inset_0_-2px_0_0_#565656]";
  const sizeStyles = "px-3 py-1 text-sm";

  const tagStyles = twMerge(
    baseStyles,
    innerBorderStyles,
    sizeStyles,
    className,
  );

  return (
    <span className={tagStyles} {...props}>
      {text}
    </span>
  );
};
