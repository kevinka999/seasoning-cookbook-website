import { httpModule } from "../shared/http-module";
import type { SignupResponse } from "../../types/identity-service";

export interface SignupRequest {
  email: string;
  password: string;
}

export const signupUser = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  return await httpModule.post<SignupResponse>(
    "identity",
    "/auth/signup",
    data
  );
};
