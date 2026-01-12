import { useQuery } from "@tanstack/react-query";
import { Modal, Inventory } from "../../../../components";
import { getSeasoningItems } from "../../../../api/queries/getSeasoningItems";
import { INVENTORY_COLS } from "../../../../constants/inventory";
import { parseSeasoningEffects } from "../../../../utils/seasoning-parser";
import type { SeasoningItem } from "../../../../types/seasoning-cookbook-service";
import type { InventoryItemData } from "../../../../components/InventoryItem";

type SelectSeasoningItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SeasoningItem) => void;
  selectedItemIds?: string[];
};

export const SelectSeasoningItemModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedItemIds,
}: SelectSeasoningItemModalProps) => {
  const { data: seasoningItems = [], isLoading } = useQuery({
    queryKey: ["seasoningItems"],
    queryFn: getSeasoningItems,
    enabled: isOpen,
  });

  const inventoryItems = seasoningItems.map((item, index) => {
    const row = Math.floor(index / INVENTORY_COLS) + 1;
    const col = (index % INVENTORY_COLS) + 1;

    const inventoryItemData: InventoryItemData = {
      path: item.image
        ? `/images/seasoning/${item.image}`
        : "/images/missingno.webp",
      name: item.itemName,
      description: parseSeasoningEffects(item.effects),
      onClick: () => {
        onSelect(item);
        onClose();
      },
    };

    return {
      id: item._id,
      row,
      col,
      data: inventoryItemData,
    };
  });

  const rows = Math.ceil(seasoningItems.length / INVENTORY_COLS) || 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Seasoning Item"
      className="max-w-2xl"
    >
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <span className="text-secondary">Loading...</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <Inventory
              rows={rows}
              cols={INVENTORY_COLS}
              items={inventoryItems}
              selectedItemIds={selectedItemIds}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
