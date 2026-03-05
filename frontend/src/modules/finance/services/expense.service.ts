import { api } from "@/lib/api";
import { Expense } from "../types";

export const expenseService = {
  getById: (id: number) => api.get<Expense>(`/expenses/${id}`),

  markAsPaid: (id: number) => api.patch(`/expenses/${id}/pay`, {}),
};
