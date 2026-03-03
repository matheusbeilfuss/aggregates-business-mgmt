import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { ProductSupplier } from "../types";
import { productSupplierService } from "../services/productSupplier.service";

export function useProductSupplier(id: number, { enabled = true } = {}) {
  const fetcher = useCallback(() => productSupplierService.getById(id), [id]);

  const { data, loading, error, refetch } = useApi<ProductSupplier>(fetcher, {
    enabled,
  });

  return { data, loading, error, refetch };
}
