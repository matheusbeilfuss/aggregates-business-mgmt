import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { financeService } from "../services/finance.service";
import { DatePeriod } from "@/types";
import { Expense } from "../types";

type Options = DatePeriod & { enabled?: boolean };

export const useFinanceExpenses = ({
  startDate,
  endDate,
  enabled = true,
}: Options) => {
  const fetcher = useCallback(
    () => financeService.getExpenses(startDate, endDate),
    [startDate, endDate],
  );

  return useApi<Expense[]>(fetcher, { enabled });
};
