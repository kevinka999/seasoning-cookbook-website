import { httpModule } from "../shared/http-module";
import type { User } from "../../types/identity-service";

export const getUserData = async (): Promise<User> => {
  return await httpModule.get<User>("identity", "/me");
};
