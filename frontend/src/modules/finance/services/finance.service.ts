import { api } from "@/lib/api";
import { Expense, Payment } from "../types";
import { toIsoDate } from "@/utils";

const getExpenses = (startDate: Date, endDate: Date) =>
  api.get<Expense[]>(
    `/expenses?startDate=${toIsoDate(startDate)}&endDate=${toIsoDate(endDate)}`,
  );

const getPayments = (startDate: Date, endDate: Date) =>
  api.get<Payment[]>(
    `/payments?startDate=${toIsoDate(startDate)}&endDate=${toIsoDate(endDate)}`,
  );

export const financeService = { getExpenses, getPayments };
