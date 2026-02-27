import { api } from "@/lib/api";
import { Price, PriceCategory } from "../types";

export const priceService = {
  getAll: () => api.get<PriceCategory[]>("/prices"),

  getByCategory: (categoryId: number) =>
    api.get<Price[]>(`/categories/${categoryId}/prices`),
};
