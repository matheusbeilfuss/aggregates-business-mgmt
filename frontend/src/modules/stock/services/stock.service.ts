import { api } from "@/lib/api";
import type {
  StockItem,
  StockDetail,
  UpdateStockPayload,
  ReplenishStockPayload,
} from "../types";

export const stockService = {
  getAll: () => api.get<StockItem[]>("/stocks"),

  getById: (id: string) => api.get<StockDetail>(`/stocks/${id}`),

  update: (id: string, data: UpdateStockPayload) =>
    api.put<StockItem>(`/stocks/${id}`, data),

  replenish: (id: string, data: ReplenishStockPayload) =>
    api.post<StockItem>(`/stocks/${id}/replenish`, data),
};
