import { useApi } from "@/hooks/useApi";
import { useCallback } from "react";
import { Expense } from "../types";
import { expenseService } from "../services/expense.service";

export function useExpense(
  id: number | null | undefined,
  { enabled = true } = {},
) {
  const fetcher = useCallback(() => expenseService.getById(id!), [id]);

  return useApi<Expense>(fetcher, {
    enabled: enabled && id != null && id > 0,
  });
}
