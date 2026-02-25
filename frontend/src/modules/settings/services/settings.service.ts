import { api } from "@/lib/api";
import { Settings } from "../types";

export const settingsService = {
  get: () => api.get<Settings>("/settings"),

  update: (data: Settings) => api.put<Settings>("/settings", data),
};
