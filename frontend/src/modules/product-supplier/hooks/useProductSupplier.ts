import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { ProductSupplier } from "../types";
import { productSupplierService } from "../services/productSupplier.service";

export function useProductSupplier(id: number | null) {
  const fetcher = useCallback(() => productSupplierService.getById(id!), [id]);

  const { data, loading, error } = useApi<ProductSupplier>(fetcher, {
    enabled: !!id,
  });

  return { data, loading, error };
}
