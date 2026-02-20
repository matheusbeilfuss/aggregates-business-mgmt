import { api } from "@/lib/api";
import { User } from "../types";

export const userService = {
  getMe: () => api.get<User>("/users/me"),

  getAvatar: (version?: string) =>
    api.getBlob(`/users/me/avatar${version ? `?v=${version}` : ""}`),

  update: async (
    id: number,
    data: Partial<User>,
    image?: File,
  ): Promise<User> => {
    const formData = new FormData();

    formData.append(
      "user",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );

    if (image) {
      formData.append("image", image);
    }

    return api.putMultipart<User>(`/users/${id}`, formData);
  },
};
