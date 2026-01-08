import { httpModule } from "../shared/http-module";

interface GetUserNicknameResponse {
  nickname: string;
}

export const getUserNickname = async (): Promise<GetUserNicknameResponse> => {
  return await httpModule.get<GetUserNicknameResponse>(
    "seasoningCookbook",
    "/users/nickname",
  );
};

