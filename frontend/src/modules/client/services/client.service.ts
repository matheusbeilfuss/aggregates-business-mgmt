import { api } from "@/lib/api";
import { Client, CreateClientPayload } from "../types";

export const clientService = {
  getAll: () => api.get<Client[]>(`/clients`),

  search: (name: string) =>
    api.get<Client[]>(`/clients?search=${encodeURIComponent(name)}`),

  getById: (clientId: number) => api.get<Client>(`/clients/${clientId}`),

  insert: (data: CreateClientPayload) => api.post<Client>(`/clients`, data),

  update: (clientId: number, data: CreateClientPayload) =>
    api.put<Client>(`/clients/${clientId}`, data),

  delete: (clientId: number) => api.delete(`/clients/${clientId}`),
};
