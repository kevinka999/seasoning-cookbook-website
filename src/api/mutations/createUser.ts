import { httpModule } from "../shared/http-module";
import type { SeasoningCookbookUser } from "../../types/seasoning-cookbook-service";

interface CreateUserRequest {
  nickname: string;
}

export const createUser = async (
  data: CreateUserRequest
): Promise<SeasoningCookbookUser> => {
  return await httpModule.post<SeasoningCookbookUser>(
    "seasoningCookbook",
    "/users",
    data
  );
};
