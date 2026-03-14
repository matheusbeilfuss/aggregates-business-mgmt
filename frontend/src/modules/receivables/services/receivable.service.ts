import { api } from "@/lib/api";
import { Receivable } from "../types";
import { toIsoDate } from "@/utils";

export const receivableService = {
  getAll: (startDate?: Date, endDate?: Date) => {
    if (startDate && endDate) {
      return api.get<Receivable[]>(
        `/orders/receivables?startDate=${toIsoDate(startDate)}&endDate=${toIsoDate(endDate)}`,
      );
    }
    return api.get<Receivable[]>("/orders/receivables");
  },
};
