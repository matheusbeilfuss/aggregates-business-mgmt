import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { FixedExpense } from "../types";

export const useFixedExpenses = () => {
  const fetcher = useCallback(
    () => api.get<FixedExpense[]>("/fixed-expenses"),
    [],
  );
  return useApi(fetcher);
};
