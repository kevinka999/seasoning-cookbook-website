import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type BookProps = React.ComponentPropsWithoutRef<"div"> & {
  className?: string;
  children?: React.ReactNode;
};

export const Book = ({ className, children, ...props }: BookProps) => {
  const [borderDimensions, setBorderDimensions] = useState({
    top: { height: 0 },
    bottom: { height: 0 },
    left: { width: 0 },
    right: { width: 0 },
  });

  useEffect(() => {
    const loadImageDimensions = () => {
      const images = {
        top: new Image(),
        bottom: new Image(),
        left: new Image(),
        right: new Image(),
      };

      images.top.src = "/images/book/stretchable-top-border.webp";
      images.bottom.src = "/images/book/stretchable-bottom-border.webp";
      images.left.src = "/images/book/stretchable-left-border.webp";
      images.right.src = "/images/book/stretchable-right-border.webp";

      let loadedCount = 0;
      const totalImages = 4;

      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setBorderDimensions({
            top: { height: images.top.naturalHeight },
            bottom: { height: images.bottom.naturalHeight },
            left: { width: images.left.naturalWidth },
            right: { width: images.right.naturalWidth },
          });
        }
      };

      images.top.onload = checkAllLoaded;
      images.bottom.onload = checkAllLoaded;
      images.left.onload = checkAllLoaded;
      images.right.onload = checkAllLoaded;
    };

    loadImageDimensions();
  }, []);

  const gridContainerStyles =
    "grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto]";

  const cornerStyles = "block";
  const contentAreaStyles = "relative w-full h-full";

  return (
    <div className={twMerge(gridContainerStyles, className)} {...props}>
      <img
        src="/images/book/left-top-border.webp"
        alt=""
        className={cornerStyles}
      />
      <img
        src="/images/book/stretchable-top-border.webp"
        alt=""
        className="object-fill"
        style={{
          height: borderDimensions.top.height || "auto",
          width: "100%",
        }}
      />
      <img
        src="/images/book/right-top-border.webp"
        alt=""
        className={cornerStyles}
      />

      <img
        src="/images/book/stretchable-left-border.webp"
        alt=""
        className="object-fill"
        style={{
          width: borderDimensions.left.width || "auto",
          height: "100%",
        }}
      />
      <div className={contentAreaStyles}>
        <img
          src="/images/book/content.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-fill"
        />
        <div className="relative z-10 min-h-0 min-w-0">{children}</div>
      </div>
      <img
        src="/images/book/stretchable-right-border.webp"
        alt=""
        className="object-fill"
        style={{
          width: borderDimensions.right.width || "auto",
          height: "100%",
        }}
      />

      <img
        src="/images/book/left-bottom-border.webp"
        alt=""
        className={cornerStyles}
      />
      <img
        src="/images/book/stretchable-bottom-border.webp"
        alt=""
        className="object-fill"
        style={{
          height: borderDimensions.bottom.height || "auto",
          width: "100%",
        }}
      />
      <img
        src="/images/book/right-bottom-border.webp"
        alt=""
        className={cornerStyles}
      />
    </div>
  );
};
