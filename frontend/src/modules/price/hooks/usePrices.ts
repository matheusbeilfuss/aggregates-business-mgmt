import { useCallback } from "react";
import { priceService } from "../services/price.service";
import { PriceCategory } from "../types";
import { useApi } from "@/hooks/useApi";

export function usePrices({ enabled = true } = {}) {
  const fetcher = useCallback(() => priceService.getAll(), []);

  return useApi<PriceCategory[]>(fetcher, { enabled });
}
