import { httpModule } from "../shared/http-module";
import type {
  Recipe,
  RecipeCategory,
} from "../../types/seasoning-cookbook-service";

interface CreateRecipeRequest {
  pokemonId: string;
  seasoningItemIds: string[];
  category: RecipeCategory[];
  description?: string | null;
}

export const createRecipe = async (
  data: CreateRecipeRequest,
): Promise<Recipe> => {
  return await httpModule.post<Recipe>("seasoningCookbook", "/recipes", data);
};
