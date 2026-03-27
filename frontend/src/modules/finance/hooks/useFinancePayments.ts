import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { financeService } from "../services/finance.service";
import { DatePeriod } from "@/types";
import { Payment } from "../types";

type Options = DatePeriod & { enabled?: boolean };

export const useFinancePayments = ({
  startDate,
  endDate,
  enabled = true,
}: Options) => {
  const fetcher = useCallback(
    () => financeService.getPayments(startDate, endDate),
    [startDate, endDate],
  );

  return useApi<Payment[]>(fetcher, { enabled });
};
