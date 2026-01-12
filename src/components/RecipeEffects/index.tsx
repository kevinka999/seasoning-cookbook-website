import { RecipePot, PokemonTypeTag, Tag } from "../";
import {
  combineRecipeEffects,
  formatCombinedEffect,
} from "../../utils/seasoning-parser";
import { capitalizeWords, normalizeWord } from "../../utils";
import { POKEMON_TYPES } from "../../constants/pokemon";
import type { InventoryItemData } from "../InventoryItem";
import type {
  SeasoningItem,
  PokemonType,
} from "../../types/seasoning-cookbook-service";

type RecipeEffectsProps = {
  items: (InventoryItemData | null)[];
  seasoningItems: SeasoningItem[];
  onItemClick?: (slot: number) => void;
  emptyLabel?: string;
};

const formatCombinedEffects = (
  effect: ReturnType<typeof combineRecipeEffects>[number],
): React.ReactNode => {
  const formattedEffects = formatCombinedEffect(effect);

  return (
    <span className="flex flex-row flex-wrap items-center gap-2">
      {formattedEffects.map((part, partIndex) => {
        if (typeof part === "string") {
          return (
            <span
              key={partIndex}
              className="text-lg leading-relaxed text-secondary"
            >
              {part}
            </span>
          );
        }

        if (part.type === "category") {
          const type = part.content.toLowerCase() as PokemonType;
          if (POKEMON_TYPES.includes(type as PokemonType)) {
            return (
              <PokemonTypeTag key={partIndex} type={type} className="text-xs" />
            );
          }

          return (
            <Tag
              key={partIndex}
              text={normalizeWord(part.content)}
              className="text-xs"
            />
          );
        }

        if (part.type === "value") {
          return (
            <Tag
              key={partIndex}
              text={capitalizeWords(part.content)}
              className="p-1 text-xs"
            />
          );
        }

        return null;
      })}
    </span>
  );
};

export const RecipeEffects = ({
  items,
  seasoningItems,
  onItemClick,
  emptyLabel,
}: RecipeEffectsProps) => {
  const combinedEffects = combineRecipeEffects(seasoningItems);

  return (
    <div className="flex flex-row items-start gap-4">
      <RecipePot
        items={items}
        onItemClick={onItemClick}
        emptyLabel={emptyLabel}
      />

      {combinedEffects.length > 0 && (
        <div className="flex flex-1 flex-col items-start gap-2">
          <span className="text-lg font-semibold text-primary">
            Combined Effects
          </span>

          <div className="flex flex-col gap-1 pl-2">
            {combinedEffects.map((effect, effectIndex) => (
              <div
                key={effectIndex}
                className="flex flex-row items-center gap-2"
              >
                <div className="h-1.5 w-1.5 shrink-0 bg-[#3f3f3f]" />
                {formatCombinedEffects(effect)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
