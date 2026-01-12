import { Card } from "../Card";
import { InventoryItem } from "../InventoryItem";
import type { InventoryItemData } from "../InventoryItem";

type RecipePotProps = {
  items: (InventoryItemData | null)[];
  onItemClick?: (slot: number) => void;
  cookingPotImage?: string;
  emptyLabel?: string;
};

export const RecipePot = ({
  items,
  onItemClick,
  cookingPotImage = "/images/red-campfire-pot.png",
  emptyLabel = "Choose seasoning",
}: RecipePotProps) => {
  return (
    <Card
      className="flex h-min w-min flex-col items-center gap-2 p-4"
      variant="sunken"
    >
      <img src={cookingPotImage} alt="Cooking Pot" className="h-24 w-24" />
      <span className="text-lg text-primary">Recipe</span>
      <div className="flex flex-row gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <InventoryItem
              data={{
                path: item?.path,
                name: item?.name || emptyLabel,
                description: item?.description,
                onClick: onItemClick ? () => onItemClick(index) : undefined,
              }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
