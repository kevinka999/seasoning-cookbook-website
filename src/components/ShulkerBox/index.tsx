import { twMerge } from "tailwind-merge";
import { Card } from "../Card";
import { Inventory } from "../Inventory";
import type { InventoryItemData } from "../InventoryItem";

type InventoryItemPosition = {
  id: string;
  row: number;
  col: number;
  data: InventoryItemData;
};

type ShulkerBoxProps = {
  className?: string;
  title: string;
  rows: number;
  cols: number;
  items: InventoryItemPosition[];
};

export const ShulkerBox = ({
  className,
  title,
  rows,
  cols,
  items,
}: ShulkerBoxProps) => {
  const titleStyles = "text-xl text-[#3f3f3f] py-2";
  const paddingStyles = "px-4 pb-4 pt-0";

  return (
    <Card className={twMerge("w-fit", paddingStyles, className)}>
      <p className={titleStyles}>{title}</p>
      <Inventory rows={rows} cols={cols} items={items} />
    </Card>
  );
};
