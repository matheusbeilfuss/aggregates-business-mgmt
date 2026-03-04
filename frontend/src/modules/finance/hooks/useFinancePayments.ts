import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { financeService } from "../services/finance.service";
import { DatePeriod } from "@/types";

export const useFinancePayments = ({ startDate, endDate }: DatePeriod) => {
  const fetcher = useCallback(
    () => financeService.getPayments(startDate, endDate),
    [startDate, endDate],
  );

  return useApi(fetcher);
};
