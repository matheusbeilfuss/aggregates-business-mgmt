import { useCallback } from "react";
import { productSupplierService } from "../services/productSupplier.service";
import { ProductSupplier } from "../types";
import { useApi } from "@/hooks/useApi";

export function useCategoryProductSuppliers(
  categoryId: number,
  { enabled = true } = {},
) {
  const fetcher = useCallback(
    () => productSupplierService.getByCategoryId(categoryId),
    [categoryId],
  );

  const { data, loading, error, refetch } = useApi<ProductSupplier[]>(fetcher, {
    enabled,
  });

  return { data: (data ?? []) as ProductSupplier[], loading, error, refetch };
}
