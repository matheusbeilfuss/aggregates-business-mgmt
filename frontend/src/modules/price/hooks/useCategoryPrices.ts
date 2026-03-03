import { useCallback } from "react";
import { priceService } from "../services/price.service";
import { useApi } from "@/hooks/useApi";
import { Price } from "../types";

export function useCategoryPrices(categoryId: number, { enabled = true } = {}) {
  const fetcher = useCallback(
    () => priceService.getByCategory(categoryId),
    [categoryId],
  );

  const { data, loading, error, refetch } = useApi<Price[]>(fetcher, {
    enabled,
  });

  return { data: (data ?? []) as Price[], loading, error, refetch };
}
