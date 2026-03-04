import { api } from "@/lib/api";
import { Expense, Payment } from "../types";
import { format } from "date-fns";

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

const getExpenses = (startDate: Date, endDate: Date) =>
  api.get<Expense[]>(
    `/expenses?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`,
  );

const getPayments = (startDate: Date, endDate: Date) =>
  api.get<Payment[]>(
    `/payments?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`,
  );

export const financeService = { getExpenses, getPayments };
