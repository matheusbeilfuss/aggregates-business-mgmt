import { api } from "@/lib/api";
import { Settings } from "../types";

export const settingsService = {
  get: () => api.get<Settings>("/settings"),

  update: (businessName: string) =>
    api.put<Settings>("/settings", { businessName }),

  getBusinessImage: () => api.getBlob("/settings/business-image"),

  updateBusinessImage: async (image: File): Promise<Settings> => {
    const formData = new FormData();
    formData.append("image", image);
    return api.patchMultipart<Settings>("/settings/business-image", formData);
  },

  deleteBusinessImage: () => api.delete("/settings/business-image"),
};
