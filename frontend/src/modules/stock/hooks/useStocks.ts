import { useCallback } from "react";
import { stockService } from "../services/stock.service";
import { useApi } from "@/hooks/useApi";
import { StockItem } from "../types";

export function useStocks() {
  const fetcher = useCallback(() => stockService.getAll(), []);

  return useApi<StockItem[]>(fetcher);
}
