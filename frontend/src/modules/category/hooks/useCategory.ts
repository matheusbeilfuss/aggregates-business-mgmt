import { useCallback } from "react";
import { categoryService } from "../services/category.service";
import { Category } from "../types";
import { useApi } from "@/hooks/useApi";

export function useCategory(
  id: number | null | undefined,
  { enabled = true } = {},
) {
  const fetcher = useCallback(() => categoryService.getById(id!), [id]);

  return useApi<Category>(fetcher, {
    enabled: enabled && id != null && id > 0,
  });
}
