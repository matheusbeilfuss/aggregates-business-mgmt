import { api } from "@/lib/api";
import { User } from "../types";

export const userService = {
  getMe: () => api.get<User>("/users/me"),

  getAvatar: () => api.getBlob("/users/me/avatar"),
};
