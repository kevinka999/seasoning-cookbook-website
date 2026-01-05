import { httpModule } from "../shared/http-module";
import type { LoginResponse } from "../../types/identity-service";

export interface LoginRequest {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  return await httpModule.post<LoginResponse>("identity", "/auth/login", data);
};
