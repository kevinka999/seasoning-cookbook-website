import { httpModule } from "../shared/http-module";
import type { LoginRequest, LoginResponse } from "../../types/identity-service";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  return await httpModule.post<LoginResponse>("identity", "/auth/login", data);
};
