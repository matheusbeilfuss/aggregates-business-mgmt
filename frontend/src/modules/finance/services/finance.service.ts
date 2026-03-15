import { api } from "@/lib/api";
import { Expense, FuelExpense, Payment } from "../types";
import { toIsoDate } from "@/utils";
import { ExpenseTypeEnum } from "@/types";

function getExpenses(
  startDate: Date,
  endDate: Date,
  type: ExpenseTypeEnum.FUEL,
): Promise<FuelExpense[]>;
function getExpenses(
  startDate: Date,
  endDate: Date,
  type?: ExpenseTypeEnum,
): Promise<Expense[]>;
function getExpenses(
  startDate: Date,
  endDate: Date,
  type?: ExpenseTypeEnum,
): Promise<FuelExpense[] | Expense[]> {
  const params = new URLSearchParams({
    startDate: toIsoDate(startDate),
    endDate: toIsoDate(endDate),
  });

  if (type) params.append("type", type);

  if (type === ExpenseTypeEnum.FUEL) {
    return api.get<FuelExpense[]>(`/expenses?${params.toString()}`);
  }

  return api.get<Expense[]>(`/expenses?${params.toString()}`);
}

const getPayments = (startDate: Date, endDate: Date) =>
  api.get<Payment[]>(
    `/payments?startDate=${toIsoDate(startDate)}&endDate=${toIsoDate(endDate)}`,
  );

export const financeService = { getExpenses, getPayments };
