import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { balanceService } from "../services/balance.service";
import { Expense } from "@/modules/finance/types";

type Options = {
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
};

export function useBalanceExpenses({
  startDate,
  endDate,
  enabled = true,
}: Options) {
  const fetcher = useCallback(
    () => balanceService.getBalanceExpenses(startDate, endDate),
    [startDate, endDate],
  );

  return useApi<Expense[]>(fetcher, { enabled });
}
