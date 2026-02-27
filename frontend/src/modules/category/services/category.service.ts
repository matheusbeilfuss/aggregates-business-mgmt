import { api } from "@/lib/api";
import { Price } from "@/modules/price/types";
import { Category } from "../types";

export const categoryService = {
  getAll: () => api.get<Category[]>("/categories"),

  getPricesById: (categoryId: number) =>
    api.get<Price[]>(`/categories/${categoryId}/prices`),
};
