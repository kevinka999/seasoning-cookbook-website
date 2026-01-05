import { useState } from "react";
import { twMerge } from "tailwind-merge";

type ItemFrameProps = {
  src: string;
  alt: string;
  className?: string;
  scale?: number;
  onClick?: () => void;
  pulsingIcon?: boolean;
};

export const ItemFrame = ({
  src,
  alt,
  className,
  scale = 1,
  onClick,
  pulsingIcon,
}: ItemFrameProps) => {
  const [imageError, setImageError] = useState(false);

  const fallbackSrc = "/images/missingno.webp";
  const imageSrc = imageError ? fallbackSrc : src;

  const frameStyles =
    "relative bg-cover bg-center bg-no-repeat overflow-hidden aspect-square";
  const frameBackground = {
    backgroundImage: 'url("/images/item-frame.png")',
  };

  const clickableStyles = onClick
    ? "cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
    : "";

  const innerImageStyles = "h-full w-full object-contain p-2";

  const pulseMaxScale = scale * 1.2;

  return (
    <div
      className={twMerge(frameStyles, clickableStyles, className)}
      style={frameBackground}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={innerImageStyles}
        style={{
          ...(pulsingIcon
            ? {
                "--scale-start": scale,
                "--scale-end": pulseMaxScale,
                animation: "pulse-scale-dynamic 2s ease-in-out infinite",
              }
            : { transform: `scale(${scale})` }),
        }}
        onError={() => {
          if (!imageError) {
            setImageError(true);
          }
        }}
      />
    </div>
  );
};
