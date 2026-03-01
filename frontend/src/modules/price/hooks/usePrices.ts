import { useCallback } from "react";
import { priceService } from "../services/price.service";
import { PriceCategory } from "../types";
import { useApi } from "@/hooks/useApi";

export function usePrices() {
  const fetcher = useCallback(() => priceService.getAll(), []);

  const { data, loading, error, refetch } = useApi<PriceCategory[]>(fetcher);

  return { data: data ?? [], loading, error, refetch };
}
