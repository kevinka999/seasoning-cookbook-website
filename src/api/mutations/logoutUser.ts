import { httpModule } from "../shared/http-module";

export const logoutUser = async (): Promise<void> => {
  await httpModule.post("identity", "/auth/logout", {});
};
