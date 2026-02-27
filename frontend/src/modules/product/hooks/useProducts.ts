import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { Product } from "../types";
import { productService } from "../services/product.service";

export function useProducts() {
  const fetcher = useCallback(() => productService.getAll(), []);

  return useApi<Product[]>(fetcher);
}
