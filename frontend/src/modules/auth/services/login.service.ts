import { api } from "@/lib/api";
import { LoginPayload } from "../types";

export const loginService = {
  login: (data: LoginPayload) => {
    return api.post<void>("/login", data);
  },
};
