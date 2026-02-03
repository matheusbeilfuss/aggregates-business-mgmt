import { useCallback } from "react";
import { stockService, categoryService } from "../services/stock.service";
import { useApi } from "@/hooks/useApi";
import { Category, StockDetail, StockItem } from "../types";

export function useStocks() {
  const fetcher = useCallback(() => stockService.getAll(), []);

  return useApi<StockItem[]>(fetcher);
}

export function useStock(id: string | null) {
  const fetcher = useCallback(() => stockService.getById(id!), [id]);

  return useApi<StockDetail>(fetcher, { enabled: !!id });
}

export function useCategories() {
  const fetcher = useCallback(() => categoryService.getAll(), []);

  return useApi<Category[]>(fetcher);
}
