import { api } from "@/lib/api";
import { Client, ClientDetail, OrderItem, Phone } from "../types";

export const orderService = {
  getByScheduledDate: (scheduledDate: string) =>
    api.get<OrderItem[]>(`/orders?scheduledDate=${scheduledDate}`),

  getPhonesByClientId: (clientId: number) =>
    api.get<Phone[]>(`/clients/${clientId}/phones`),

  getAllClients: () => api.get<Client[]>(`/clients`),

  getClientById: (clientId: number) =>
    api.get<ClientDetail>(`/clients/${clientId}`),
};
