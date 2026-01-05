import { httpModule } from "../shared/http-module";
import type {
  SignupRequest,
  SignupResponse,
} from "../../types/identity-service";

export const signupUser = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  return await httpModule.post<SignupResponse>(
    "identity",
    "/auth/signup",
    data
  );
};
