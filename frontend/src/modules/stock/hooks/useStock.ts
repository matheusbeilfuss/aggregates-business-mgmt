import { useCallback } from "react";
import { stockService } from "../services/stock.service";
import { StockDetail } from "../types";
import { useApi } from "@/hooks/useApi";

export function useStock(
  id: number | null | undefined,
  { enabled = true } = {},
) {
  const fetcher = useCallback(() => stockService.getById(id!), [id]);

  return useApi<StockDetail>(fetcher, {
    enabled: enabled && id != null && id > 0,
  });
}
