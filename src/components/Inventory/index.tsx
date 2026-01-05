import { InventoryItem, type InventoryItemData } from "../InventoryItem";

type InventoryItemPosition = {
  id: string;
  row: number;
  col: number;
  data: InventoryItemData;
};

type InventoryProps = {
  rows: number;
  cols: number;
  items: InventoryItemPosition[];
  lazyLoad?: boolean;
  scale?: number;
};

export const Inventory = ({
  rows,
  cols,
  items,
  lazyLoad = false,
  scale,
}: InventoryProps) => {
  const gridStyles = "grid gap-0";
  const gridWidth = cols * 48;

  const itemsMap = new Map<string, InventoryItemPosition>();
  items.forEach((item) => {
    itemsMap.set(`${item.row}-${item.col}`, item);
  });

  const gridItems = Array.from({ length: rows * cols }, (_, index) => {
    const row = Math.floor(index / cols) + 1;
    const col = (index % cols) + 1;
    const item = itemsMap.get(`${row}-${col}`);

    const key = item?.id ?? `empty-${row}-${col}`;

    return (
      <InventoryItem
        key={key}
        data={item?.data}
        lazyLoad={lazyLoad}
        scale={scale}
      />
    );
  });

  return (
    <div
      className={gridStyles}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        width: `${gridWidth}px`,
      }}
    >
      {gridItems}
    </div>
  );
};
