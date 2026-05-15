import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { balanceService } from "../services/balance.service";
import { MonthlySales } from "../types";

type Options = {
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
};

export function useMonthlySales({
  startDate,
  endDate,
  enabled = true,
}: Options) {
  const fetcher = useCallback(
    () => balanceService.getMonthlySales(startDate, endDate),
    [startDate, endDate],
  );

  return useApi<MonthlySales[]>(fetcher, { enabled });
}
