import { api } from "@/lib/api";
import { Price } from "../types";

export const priceService = {
  getByCategory: (categoryId: number) =>
    api.get<Price[]>(`/categories/${categoryId}/prices`),
};
