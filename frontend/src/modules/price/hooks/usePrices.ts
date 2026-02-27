import { useCallback } from "react";
import { priceService } from "../services/price.service";
import { useApi } from "@/hooks/useApi";
import { Price } from "../types";

export function usePrices(categoryId: number | null) {
  const fetcher = useCallback(
    () => priceService.getByCategory(categoryId!),
    [categoryId],
  );

  const { data, loading, error } = useApi<Price[]>(fetcher, {
    enabled: !!categoryId,
  });

  return { data: data ?? [], loading, error };
}
