import { twMerge } from "tailwind-merge";

type SizeVariant = "sm" | "md" | "lg";
type ColorVariant = "default" | "blue" | "green";

const sizeVariant: Record<SizeVariant, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-md",
  lg: "px-6 py-3 text-lg",
};

const colorVariant: Record<ColorVariant, string> = {
  default: "bg-[#6f6f6f]",
  blue: "bg-[#5865F2]",
  green: "bg-[#2ecc40]",
};

const innerBorderVariant: Record<ColorVariant, string> = {
  default:
    "shadow-[inset_0_2px_0_0_#aaaaaa,inset_2px_0_0_0_#aaaaaa,inset_-2px_0_0_0_#565656,inset_0_-2px_0_0_#565656]",
  blue: "shadow-[inset_0_2px_0_0_#7c88ff,inset_2px_0_0_0_#7c88ff,inset_-2px_0_0_0_#4752c4,inset_0_-2px_0_0_#4752c4]",
  green:
    "shadow-[inset_0_2px_0_0_#38e87d,inset_2px_0_0_0_#38e87d,inset_-2px_0_0_0_#207a36,inset_0_-2px_0_0_#207a36]",
};

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  className?: string;
  size?: SizeVariant;
  variant?: ColorVariant;
};

export const Button = ({
  className,
  size = "md",
  variant = "default",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "border-2 border-black rounded-none text-white minecraft-text-shadow font-minecraft";
  const colorStyles = colorVariant[variant];
  const innerBorderStyles = innerBorderVariant[variant];
  const sizeStyles = sizeVariant[size];
  const hoverStyles = disabled ? "" : "hover:border-white";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  const buttonStyles = twMerge(
    baseStyles,
    colorStyles,
    sizeStyles,
    innerBorderStyles,
    hoverStyles,
    disabledStyles,
    className,
  );

  return <button className={buttonStyles} disabled={disabled} {...props} />;
};
