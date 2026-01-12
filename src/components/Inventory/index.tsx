import { InventoryItem, type InventoryItemData } from "../InventoryItem";
import { SelectableInventoryItem } from "../SelectableInventoryItem";

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
  selectedItemIds?: string[];
};

export const Inventory = ({
  rows,
  cols,
  items,
  lazyLoad = false,
  scale,
  selectedItemIds,
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

    if (!item?.data) {
      return (
        <InventoryItem
          key={key}
          data={undefined}
          lazyLoad={lazyLoad}
          scale={scale}
        />
      );
    }

    const isSelected = selectedItemIds?.includes(item.id) ?? false;

    if (selectedItemIds !== undefined) {
      return (
        <SelectableInventoryItem
          key={key}
          data={item.data}
          isSelected={isSelected}
          onToggle={item.data.onClick ?? (() => {})}
        />
      );
    }

    return (
      <InventoryItem
        key={key}
        data={item.data}
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
