import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { categoryService } from "../services/category.service";
import { Category } from "../types";

export function useCategories() {
  const fetcher = useCallback(() => categoryService.getAll(), []);

  return useApi<Category[]>(fetcher);
}
