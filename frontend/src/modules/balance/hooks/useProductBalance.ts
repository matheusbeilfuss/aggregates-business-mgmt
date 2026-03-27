import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { balanceService } from "../services/balance.service";
import { ProductBalance } from "../types";

type Options = {
  startDate: Date;
  endDate: Date;
};

export function useProductBalance({ startDate, endDate }: Options) {
  const fetcher = useCallback(
    () => balanceService.getProductBalance(startDate, endDate),
    [startDate, endDate],
  );

  return useApi<ProductBalance[]>(fetcher);
}
