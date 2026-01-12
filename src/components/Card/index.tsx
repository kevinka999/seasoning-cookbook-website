import { twMerge } from "tailwind-merge";

type CardVariant = "raised" | "sunken";

type CardProps = Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
  className?: string;
  variant?: CardVariant;
  title?: React.ReactNode;
};

const innerBorderVariant: Record<CardVariant, string> = {
  raised:
    "border-2 border-black shadow-[inset_0_4px_0_0_#ffffff,inset_4px_0_0_0_#ffffff,inset_-4px_0_0_0_#555555,inset_0_-4px_0_0_#555555]",
  sunken:
    "shadow-[inset_0_2px_0_0_#555555,inset_2px_0_0_0_#555555,inset_-2px_0_0_0_#ffffff,inset_0_-2px_0_0_#ffffff]",
};

export const Card = ({
  className,
  variant = "raised",
  title,
  children,
  ...props
}: CardProps) => {
  const baseStyles = "bg-[#c6c6c6] rounded-sm";
  const innerBorderStyles = innerBorderVariant[variant];

  const cardStyles = twMerge(baseStyles, innerBorderStyles, className);

  return (
    <div className={cardStyles} {...props}>
      {title && (
        <div className="minecraft-text-shadow font-minecraft rounded-t-sm border-b-2 border-black bg-[#808080] px-4 py-2 text-2xl text-white shadow-[inset_0_2px_0_0_#ffffff,inset_2px_0_0_0_#ffffff,inset_-2px_0_0_0_#555555,inset_0_-2px_0_0_#555555]">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};
