import { api } from "@/lib/api";
import type {
  StockItem,
  StockDetail,
  UpdateStockPayload,
  ReplenishStockPayload,
} from "../types";

export const stockService = {
  getAll: () => api.get<StockItem[]>("/stocks"),

  getById: (id: number) => api.get<StockDetail>(`/stocks/${id}`),

  update: (id: number, data: UpdateStockPayload) =>
    api.put<StockItem>(`/stocks/${id}`, data),

  replenish: (id: number, data: ReplenishStockPayload) =>
    api.post<StockItem>(`/stocks/${id}/replenish`, data),
};
