import { httpModule } from "../shared/http-module";
import type { Recipe } from "../../types/seasoning-cookbook-service";

interface GetRecipesParams {
  sortBy?: "most-upvotes" | "least-upvotes";
  pokemonIds?: string | string[];
  seasoningItemIds?: string | string[];
}

export const getRecipes = async (
  params?: GetRecipesParams,
): Promise<Recipe[]> => {
  const queryParams = new URLSearchParams();

  if (params?.sortBy) {
    queryParams.append("sortBy", params.sortBy);
  }

  if (params?.pokemonIds) {
    const pokemonIdsArray = Array.isArray(params.pokemonIds)
      ? params.pokemonIds
      : [params.pokemonIds];
    queryParams.append("pokemonIds", pokemonIdsArray.join(","));
  }

  if (params?.seasoningItemIds) {
    const seasoningItemIdsArray = Array.isArray(params.seasoningItemIds)
      ? params.seasoningItemIds
      : [params.seasoningItemIds];
    queryParams.append("seasoningItemIds", seasoningItemIdsArray.join(","));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/recipes?${queryString}` : "/recipes";

  return await httpModule.get<Recipe[]>("seasoningCookbook", url);
};
