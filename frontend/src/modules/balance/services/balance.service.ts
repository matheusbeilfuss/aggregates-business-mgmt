import { api } from "@/lib/api";
import { ProductBalance } from "../types";
import { toIsoDate } from "@/utils";
import { Expense } from "@/modules/finance/types";

export const balanceService = {
  getProductBalance: (startDate: Date, endDate: Date) =>
    api.get<ProductBalance[]>(
      `/orders/balance-by-product?startDate=${toIsoDate(startDate)}&endDate=${toIsoDate(endDate)}`,
    ),

  getBalanceExpenses: (startDate: Date, endDate: Date) =>
    api.get<Expense[]>(
      `/expenses/balance?startDate=${toIsoDate(startDate)}&endDate=${toIsoDate(endDate)}`,
    ),
};
