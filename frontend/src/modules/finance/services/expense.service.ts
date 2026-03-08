import { api } from "@/lib/api";
import { Expense, ExpenseInputDTO } from "../types";

export const expenseService = {
  getById: (id: number) => api.get<Expense>(`/expenses/${id}`),

  markAsPaid: (id: number) => api.patch(`/expenses/${id}/pay`, {}),

  create: (data: ExpenseInputDTO) => api.post<Expense>("/expenses", data),

  update: (id: number, data: ExpenseInputDTO) =>
    api.put<Expense>(`/expenses/${id}`, data),
};
