import { httpModule } from "../shared/http-module";
import type { RefreshResponse } from "../../types/identity-service";

export const refreshToken = async (): Promise<RefreshResponse> => {
  return await httpModule.post<RefreshResponse>(
    "identity",
    "/auth/refresh",
    {}
  );
};
