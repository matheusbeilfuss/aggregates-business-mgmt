import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { financeService } from "@/modules/finance/services/finance.service";
import { FuelExpense } from "@/modules/finance/types";
import { ExpenseTypeEnum } from "@/types";

type Options = {
  startDate: Date;
  endDate: Date;
};

export function useFuelExpenses({ startDate, endDate }: Options) {
  const fetcher = useCallback(
    () => financeService.getExpenses(startDate, endDate, ExpenseTypeEnum.FUEL),
    [startDate, endDate],
  );

  return useApi<FuelExpense[]>(fetcher);
}
