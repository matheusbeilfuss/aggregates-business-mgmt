import { useCallback } from "react";
import { stockService } from "../services/stock.service";
import { StockDetail } from "../types";
import { useApi } from "@/hooks/useApi";

export function useStock(id: string | null) {
  const fetcher = useCallback(() => stockService.getById(id!), [id]);

  return useApi<StockDetail>(fetcher, { enabled: !!id });
}
