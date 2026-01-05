import { httpModule } from "../shared/http-module";
import type { Recipe } from "../../types/seasoning-cookbook-service";

interface UpvoteRecipeRequest {
  recipeId: string;
}

export const upvoteRecipe = async (
  data: UpvoteRecipeRequest
): Promise<Recipe> => {
  return await httpModule.post<Recipe>(
    "seasoningCookbook",
    "/recipes/upvote",
    data
  );
};
