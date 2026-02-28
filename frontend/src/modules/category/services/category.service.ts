import { api } from "@/lib/api";
import { Price } from "@/modules/price/types";
import { Category } from "../types";

export const categoryService = {
  getAll: () => api.get<Category[]>("/categories"),

  getById: (id: number) => api.get<Category>(`/categories/${id}`),

  getPricesById: (categoryId: number) =>
    api.get<Price[]>(`/categories/${categoryId}/prices`),
};
