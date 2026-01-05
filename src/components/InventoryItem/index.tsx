import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Popover } from "../Popover";

export type InventoryItemData = {
  path: string;
  name: string;
  description?: string;
  onClick?: () => void;
};

type InventoryItemProps = {
  className?: string;
  data?: InventoryItemData;
  lazyLoad?: boolean;
  scale?: number;
};

const LazyImage = ({
  src,
  alt,
  className,
  scale,
}: {
  src: string;
  alt: string;
  className: string;
  scale?: number;
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px",
      },
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const fallbackSrc = "/images/missingno.webp";
  const imageSrc = imageError ? fallbackSrc : src;
  const isMissingno = imageError;

  return (
    <div ref={imgRef} className={twMerge("h-full w-full", className)}>
      {shouldLoad && (
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-contain"
          style={{
            transform: !isMissingno && scale ? `scale(${scale})` : "scale(1.2)",
          }}
          loading="lazy"
          onError={() => {
            if (!imageError) {
              setImageError(true);
            }
          }}
        />
      )}
    </div>
  );
};

export const InventoryItem = ({
  className,
  data,
  lazyLoad = false,
  scale,
}: InventoryItemProps) => {
  const [imageError, setImageError] = useState(false);

  const baseStyles =
    "bg-[#8b8b8b] flex items-center justify-center aspect-square h-12 w-12 relative group cursor-pointer overflow-hidden";
  const borderStyles =
    "border-t-2 border-l-2 border-t-[#373737] border-l-[#373737] border-b-2 border-r-2 border-b-[#ffffff] border-r-[#ffffff]";
  const hoverStyles = data?.onClick ? "hover:bg-[#c5c5c5]" : "";

  const itemStyles = twMerge(baseStyles, borderStyles, hoverStyles, className);

  const fallbackSrc = "/images/missingno.webp";
  const imageSrc = imageError ? fallbackSrc : data?.path;
  const isMissingno = imageError;

  const itemContent = (
    <div className={itemStyles} onClick={data?.onClick}>
      {data?.path &&
        (lazyLoad ? (
          <LazyImage
            src={data.path}
            alt={data.name}
            className="h-full w-full"
            scale={scale}
          />
        ) : (
          <img
            src={imageSrc}
            alt={data.name}
            className="h-full w-full object-contain"
            style={{
              transform: !isMissingno && scale ? `scale(${scale})` : undefined,
            }}
            onError={() => {
              if (!imageError) {
                setImageError(true);
              }
            }}
          />
        ))}
    </div>
  );

  if (data && data.description) {
    return (
      <Popover title={data.name} description={data.description}>
        {itemContent}
      </Popover>
    );
  }

  return itemContent;
};
