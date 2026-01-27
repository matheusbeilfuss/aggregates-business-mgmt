import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { stockService, categoryService } from "../services/stock.service";
import type { StockItem, Category } from "../types";

export function useStocks() {
  const fetcher = useCallback(
    (signal: AbortSignal) => stockService.getAll(signal),
    [],
  );

  return useApi<StockItem[]>(fetcher);
}

export function useStock(id: string) {
  const fetcher = useCallback(
    (signal: AbortSignal) => stockService.getById(id, signal),
    [id],
  );

  return useApi(fetcher);
}

export function useCategories() {
  const fetcher = useCallback(
    (signal: AbortSignal) => categoryService.getAll(signal),
    [],
  );

  return useApi<Category[]>(fetcher);
}
