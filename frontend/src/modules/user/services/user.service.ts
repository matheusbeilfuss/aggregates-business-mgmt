import { api } from "@/lib/api";
import { CreateUserPayload, UpdateUserPayload, User } from "../types";

export const userService = {
  getMe: () => api.get<User>("/users/me"),

  getAvatar: (version?: string) =>
    api.getBlob(`/users/me/avatar${version ? `?v=${version}` : ""}`),

  getAll: () => api.get<User[]>(`/users`),

  getAvatarById: (id: number, version?: string) =>
    api.getBlob(`/users/${id}/avatar${version ? `?v=${version}` : ""}`),

  insert: async (data: CreateUserPayload, image?: File): Promise<User> => {
    const formData = new FormData();

    formData.append(
      "user",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      }),
    );

    if (image) formData.append("image", image);

    return api.postMultipart<User>("/users", formData);
  },

  update: async (
    id: number,
    data: UpdateUserPayload,
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

  updatePassword: (newPassword: string) =>
    api.patch("/users/me/password", { newPassword }),

  delete: (id: number) => api.delete(`/users/${id}`),
};
