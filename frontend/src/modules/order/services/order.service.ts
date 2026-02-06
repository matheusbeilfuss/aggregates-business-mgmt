import { api } from "@/lib/api";
import {
  Client,
  ClientDetail,
  CreateOrderPayload,
  OrderItem,
  Phone,
  Price,
} from "../types";

export const orderService = {
  getByScheduledDate: (scheduledDate: string) =>
    api.get<OrderItem[]>(`/orders?scheduledDate=${scheduledDate}`),

  getPhonesByClientId: (clientId: number) =>
    api.get<Phone[]>(`/clients/${clientId}/phones`),

  getAllClients: () => api.get<Client[]>(`/clients`),

  getClientById: (clientId: number) =>
    api.get<ClientDetail>(`/clients/${clientId}`),

  getCategoryPrices: (categoryId: number) =>
    api.get<Price[]>(`/categories/${categoryId}/prices`),

  create: (data: CreateOrderPayload) => api.post<OrderItem>(`/orders`, data),
};
