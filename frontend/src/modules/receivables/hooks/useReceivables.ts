import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { receivableService } from "../services/receivable.service";
import { Receivable } from "../types";

type Options = {
  startDate?: Date;
  endDate?: Date;
};

export function useReceivables({ startDate, endDate }: Options = {}) {
  const fetcher = useCallback(
    () => receivableService.getAll(startDate, endDate),
    [startDate, endDate],
  );

  return useApi<Receivable[]>(fetcher);
}
