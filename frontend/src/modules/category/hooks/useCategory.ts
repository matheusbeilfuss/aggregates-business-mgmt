import { useCallback } from "react";
import { categoryService } from "../services/category.service";
import { Category } from "../types";
import { useApi } from "@/hooks/useApi";

export function useCategory(id: number, { enabled = true } = {}) {
  const fetcher = useCallback(() => categoryService.getById(id), [id]);

  const { data, loading, error, refetch } = useApi<Category>(fetcher, {
    enabled,
  });

  return { data, loading, error, refetch };
}
