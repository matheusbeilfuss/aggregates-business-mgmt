import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { financeService } from "../services/finance.service";
import { FinancePeriod } from "../types";

export const useFinancePayments = ({ startDate, endDate }: FinancePeriod) => {
  const fetcher = useCallback(
    () => financeService.getPayments(startDate, endDate),
    [startDate, endDate],
  );

  return useApi(fetcher);
};
