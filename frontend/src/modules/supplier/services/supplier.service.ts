import { api } from "@/lib/api";
import { Supplier } from "../types";

export const supplierService = {
  getAll: () => api.get<Supplier[]>("/suppliers"),

  insert: (data: { name: string }) => api.post<Supplier>("/suppliers", data),

  update: (id: number, data: { name: string }) =>
    api.put<Supplier>(`/suppliers/${id}`, data),
};
