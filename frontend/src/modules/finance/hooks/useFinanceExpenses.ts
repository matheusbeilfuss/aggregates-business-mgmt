import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { financeService } from "../services/finance.service";
import { DatePeriod } from "@/types";

export const useFinanceExpenses = ({ startDate, endDate }: DatePeriod) => {
  const fetcher = useCallback(
    () => financeService.getExpenses(startDate, endDate),
    [startDate, endDate],
  );

  return useApi(fetcher);
};
