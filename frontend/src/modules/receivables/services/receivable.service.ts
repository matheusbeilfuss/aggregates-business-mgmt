import { api } from "@/lib/api";
import { Receivable } from "../types";
import { format } from "date-fns";

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

export const receivableService = {
  getAll: (startDate?: Date, endDate?: Date) => {
    if (startDate && endDate) {
      return api.get<Receivable[]>(
        `/orders/receivables?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`,
      );
    }
    return api.get<Receivable[]>("/orders/receivables");
  },
};
