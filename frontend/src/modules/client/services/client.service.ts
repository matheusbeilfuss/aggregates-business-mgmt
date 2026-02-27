import { api } from "@/lib/api";
import { Client, CreateClientPayload } from "../types";

export const clientService = {
  getAll: () => api.get<Client[]>(`/clients`),

  getById: (clientId: number) => api.get<Client>(`/clients/${clientId}`),

  create: (data: CreateClientPayload) => api.post<Client>(`/clients`, data),
};
