import { api } from "@/lib/api";
import { LoginPayload, LoginResponse } from "../types";

export const loginService = {
  login: (data: LoginPayload) => {
    return api.post<LoginResponse>("/login", data);
  },
};
