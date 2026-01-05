import { httpModule } from "../shared/http-module";
import type { Recipe } from "../../types/seasoning-cookbook-service";

interface CreateRecipeRequest {
  pokemonId: string;
  seasoningItemIds: string[];
  description?: string | null;
}

export const createRecipe = async (
  data: CreateRecipeRequest
): Promise<Recipe> => {
  return await httpModule.post<Recipe>("seasoningCookbook", "/recipes", data);
};
