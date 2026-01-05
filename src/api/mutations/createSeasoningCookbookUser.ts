import { httpModule } from "../shared/http-module";
import type { SeasoningCookbookUser } from "../../types/seasoning-cookbook-service";

interface CreateUserRequest {
  nickname: string;
}

export const createSeasoningCookbookUser = async (
  data: CreateUserRequest
): Promise<SeasoningCookbookUser> => {
  return await httpModule.post<SeasoningCookbookUser>(
    "seasoningCookbook",
    "/users",
    data
  );
};
