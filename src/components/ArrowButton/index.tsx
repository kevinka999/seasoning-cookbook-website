import { useState } from "react";
import { twMerge } from "tailwind-merge";

type ArrowButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const ArrowButton = ({
  direction,
  onClick,
  disabled = false,
  className = "",
}: ArrowButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (disabled) {
    return null;
  }

  const imageSrc = isHovered
    ? "/images/book/arrow-hover.webp"
    : "/images/book/arrow.webp";

  const rotationStyle =
    direction === "left" ? { transform: "rotate(180deg)" } : {};

  const baseStyles = "cursor-pointer transition-opacity duration-200";

  return (
    <button
      className={twMerge(baseStyles, className)}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={rotationStyle}
    >
      <img src={imageSrc} alt={direction === "left" ? "Previous" : "Next"} />
    </button>
  );
};
