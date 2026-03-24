import { api } from "@/lib/api";
import { ProductBalance } from "../types";
import { toIsoDate } from "@/utils";

export const balanceService = {
  getProductBalance: (startDate: Date, endDate: Date) =>
    api.get<ProductBalance[]>(
      `/orders/balance-by-product?startDate=${toIsoDate(startDate)}&endDate=${toIsoDate(endDate)}`,
    ),
};
