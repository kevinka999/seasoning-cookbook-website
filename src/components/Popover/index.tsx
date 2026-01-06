import * as PopoverPrimitive from "@radix-ui/react-popover";
import React, { type ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Z_INDEX } from "../../constants/z-index";

type PopoverProps = {
  className?: string;
  title: string;
  description: string;
  children: ReactNode;
  side?: React.ComponentProps<typeof PopoverPrimitive.Content>["side"];
  align?: React.ComponentProps<typeof PopoverPrimitive.Content>["align"];
  sideOffset?: React.ComponentProps<
    typeof PopoverPrimitive.Content
  >["sideOffset"];
};

export const Popover = ({
  className,
  title,
  description,
  children,
  side = "bottom",
  align = "start",
  sideOffset = 4,
}: PopoverProps) => {
  const [open, setOpen] = useState(false);

  const baseStyles = "bg-[#100110] border-2 border-[#100110] rounded-none";
  const innerBorderStyles =
    "shadow-[inset_0_3px_0_0_#240361,inset_3px_0_0_0_#240361,inset_-3px_0_0_0_#240361,inset_0_-3px_0_0_#240361]";
  const contentStyles = "p-2 min-w-[200px]";

  const popoverStyles = twMerge(
    baseStyles,
    innerBorderStyles,
    contentStyles,
    className,
  );

  const titleStyles = "text-[#fcfcfc] minecraft-text-shadow text-md";
  const descriptionStyles =
    "text-[#a8a8a8] minecraft-text-shadow text-md whitespace-pre-line";

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        asChild
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          style={{ zIndex: Z_INDEX.popover }}
          className={popoverStyles}
          side={side}
          align={align}
          sideOffset={sideOffset}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex flex-col">
            <p className={titleStyles}>{title}</p>
            <p className={descriptionStyles}>{description}</p>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
