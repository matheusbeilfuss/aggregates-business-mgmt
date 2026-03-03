import { useCallback } from "react";
import { priceService } from "../services/price.service";
import { useApi } from "@/hooks/useApi";
import { Price } from "../types";

export function useCategoryPrices(
  categoryId: number | null | undefined,
  { enabled = true } = {},
) {
  const fetcher = useCallback(
    () => priceService.getByCategory(categoryId!),
    [categoryId],
  );

  return useApi<Price[]>(fetcher, {
    enabled: enabled && categoryId != null && categoryId > 0,
  });
}
