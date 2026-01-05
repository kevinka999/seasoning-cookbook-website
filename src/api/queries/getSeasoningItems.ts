import { httpModule } from "../shared/http-module";
import type { SeasoningItem } from "../../types/seasoning-cookbook-service";

export const getSeasoningItems = async (): Promise<SeasoningItem[]> => {
  return await httpModule.get<SeasoningItem[]>(
    "seasoningCookbook",
    "/seasoning-items"
  );
};

