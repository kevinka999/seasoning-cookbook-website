import { useState, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { getSeasoningItems } from "../../api/queries/getSeasoningItems";
import { upvoteRecipe } from "../../api/mutations/upvoteRecipe";
import { usePaginatedRecipes } from "../../hooks/usePaginatedRecipes";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeFilters } from "./components/RecipeFilters";
import { LoadingDots, Button } from "../../components";
import type {
  Recipe,
  RecipeCategory,
  SeasoningItem,
} from "../../types/seasoning-cookbook-service";

export const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { dispatchToast } = useToast();
  const queryClient = useQueryClient();

  const [sortBy, setSortBy] = useState<"most-upvotes" | "least-upvotes" | "">(
    "",
  );
  const [pokemonIds, setPokemonIds] = useState<string[]>([]);
  const [seasoningItemIds, setSeasoningItemIds] = useState<string[]>([]);
  const [category, setCategory] = useState<RecipeCategory[]>([]);

  const {
    recipes,
    hasMore,
    loadMore,
    isLoadingMore,
    isLoading: isLoadingRecipes,
  } = usePaginatedRecipes({
    sortBy: sortBy || undefined,
    pokemonIds: pokemonIds.length > 0 ? pokemonIds : undefined,
    seasoningItemIds:
      seasoningItemIds.length > 0 ? seasoningItemIds : undefined,
  });

  const { data: seasoningItems = [] } = useQuery({
    queryKey: ["seasoningItems"],
    queryFn: getSeasoningItems,
  });

  const [upvotingRecipeId, setUpvotingRecipeId] = useState<string | null>(null);

  const upvoteMutation = useMutation({
    mutationFn: upvoteRecipe,
    onSuccess: (updatedRecipe) => {
      queryClient.setQueriesData<Recipe[]>({ queryKey: ["recipes"] }, (old) => {
        if (!old) return old;
        return old.map((recipe) =>
          recipe._id === updatedRecipe._id ? updatedRecipe : recipe,
        );
      });
      setUpvotingRecipeId(null);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upvote recipe";
      dispatchToast({
        type: "error",
        content: errorMessage,
      });
      setUpvotingRecipeId(null);
    },
  });

  const filteredRecipes = useMemo(() => {
    if (category.length === 0) return recipes;

    return recipes.filter((recipe) =>
      recipe.category.some((cat) => category.includes(cat)),
    );
  }, [recipes, category]);

  const handleUpvote = (recipeId: string) => {
    if (!isAuthenticated) {
      dispatchToast({
        type: "error",
        content: "Please log in to upvote recipes",
      });
      return;
    }

    setUpvotingRecipeId(recipeId);
    upvoteMutation.mutate({ recipeId });
  };

  const isRecipeUpvoted = (recipe: Recipe): boolean => {
    if (!user?.sub) return false;
    return recipe.upvotedBy.includes(user.sub);
  };

  const getSeasoningItemsForRecipe = (recipe: Recipe): SeasoningItem[] => {
    return recipe.seasoningItemIds
      .map((id) => seasoningItems.find((item) => item._id === id))
      .filter((item): item is SeasoningItem => item !== undefined);
  };

  return (
    <div className="flex flex-row gap-6">
      <div className="w-64 shrink-0">
        <RecipeFilters
          sortBy={sortBy}
          pokemonIds={pokemonIds}
          seasoningItemIds={seasoningItemIds}
          category={category}
          onSortByChange={setSortBy}
          onPokemonIdsChange={setPokemonIds}
          onSeasoningItemIdsChange={setSeasoningItemIds}
          onCategoryChange={setCategory}
        />
      </div>

      <div className="flex-1">
        {isLoadingRecipes ? (
          <div className="flex items-center justify-center p-8">
            <LoadingDots />
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <span className="text-secondary text-lg">No recipes found</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredRecipes.map((recipe) => {
              const recipeSeasoningItems = getSeasoningItemsForRecipe(recipe);
              const isUpvoted = isRecipeUpvoted(recipe);
              const isUpvoting =
                upvoteMutation.isPending && upvotingRecipeId === recipe._id;

              return (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  seasoningItems={recipeSeasoningItems}
                  isUpvoted={isUpvoted}
                  onUpvote={() => handleUpvote(recipe._id)}
                  isUpvoting={isUpvoting}
                />
              );
            })}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  variant="default"
                >
                  {isLoadingMore ? <LoadingDots /> : "Load More"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
