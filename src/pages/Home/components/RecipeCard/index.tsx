import {
  Card,
  UpvoteButton,
  PokemonInfo,
  RecipeEffects,
  InventoryItem,
} from "../../../../components";
import { useState } from "react";
import type {
  Recipe,
  SeasoningItem,
  RecipeCategory,
} from "../../../../types/seasoning-cookbook-service";

type RecipeCardProps = {
  recipe: Recipe;
  seasoningItems: SeasoningItem[];
  isUpvoted: boolean;
  onUpvote: () => void;
  isUpvoting?: boolean;
};

const getCategoryImage = (category: RecipeCategory): string => {
  return category === "fishing"
    ? "/images/poke_rod.png"
    : "/images/poke_snack.png";
};

const getCategoryName = (category: RecipeCategory): string => {
  return category === "fishing" ? "Fishing" : "Pokesnack";
};

export const RecipeCard = ({
  recipe,
  seasoningItems,
  isUpvoted,
  onUpvote,
  isUpvoting = false,
}: RecipeCardProps) => {
  const [avatarError, setAvatarError] = useState(false);

  const getRecipePotItems = () => {
    return recipe.seasoningItemIds.map((id) => {
      const seasoningItem = seasoningItems.find((item) => item._id === id);
      return seasoningItem
        ? {
            path: `/images/seasoning/${seasoningItem.image}`,
            name: seasoningItem.itemName,
            description: "",
          }
        : null;
    });
  };

  const avatarUrl = `https://minotar.net/helm/${recipe.authorNickname}/64`;
  const fallbackAvatar = "/images/steve.png";

  const cardTitle = (
    <div className="flex flex-row items-center gap-2">
      <img src="/icons/pokeball.png" alt="Pokeball" className="h-6 w-6" />
      <span>{recipe.pokemon.name}</span>
    </div>
  );

  return (
    <Card title={cardTitle}>
      <div className="flex flex-col gap-4 p-4">
        <PokemonInfo pokemon={recipe.pokemon} />

        <RecipeEffects
          items={getRecipePotItems()}
          seasoningItems={seasoningItems}
        />

        {recipe.description && (
          <div className="flex flex-col gap-1">
            <span className="text-md text-primary font-medium">
              Description:
            </span>
            <p className="text-secondary text-base whitespace-pre-wrap">
              {recipe.description}
            </p>
          </div>
        )}

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-2">
              <img
                src={avatarError ? fallbackAvatar : avatarUrl}
                alt={recipe.authorNickname}
                className="h-5 w-5 border-1 border-black"
                onError={() => setAvatarError(true)}
              />
              <span className="text-md text-primary font-medium">
                {recipe.authorNickname}
              </span>
            </div>

            <div className="flex flex-row items-center gap-2">
              <span className="text-primary text-sm">Recipe for:</span>
              {recipe.category.map((cat: RecipeCategory) => (
                <InventoryItem
                  key={cat}
                  data={{
                    path: getCategoryImage(cat),
                    name: getCategoryName(cat),
                  }}
                  className="h-8 w-8"
                />
              ))}
            </div>
          </div>

          <UpvoteButton
            upvoted={isUpvoted}
            upvoteCount={recipe.upvoteCount}
            onClick={onUpvote}
            disabled={isUpvoting}
          />
        </div>
      </div>
    </Card>
  );
};
