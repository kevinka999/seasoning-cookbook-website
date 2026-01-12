import { FaCheck } from "react-icons/fa";
import { InventoryItem, type InventoryItemData } from "../InventoryItem";

type SelectableInventoryItemProps = {
  data: InventoryItemData;
  isSelected: boolean;
  onToggle: () => void;
  className?: string;
};

export const SelectableInventoryItem = ({
  data,
  isSelected,
  onToggle,
  className,
}: SelectableInventoryItemProps) => {
  return (
    <div className="relative h-fit w-fit" onClick={onToggle}>
      <InventoryItem
        className={className}
        data={{
          ...data,
          onClick: onToggle,
        }}
      />
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
          <FaCheck className="h-1/2 w-1/2 text-white" />
        </div>
      )}
    </div>
  );
};
