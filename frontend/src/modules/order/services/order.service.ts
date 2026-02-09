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

  getById: (id: number) => api.get<OrderItem>(`/orders/${id}`),

  create: (data: CreateOrderPayload) => api.post<OrderItem>(`/orders`, data),

  update: (id: number, data: CreateOrderPayload) =>
    api.put<OrderItem>(`/orders/${id}`, data),

  markAsDelivered: (id: number) => api.patch(`/orders/${id}/delivered`, {}),

  addPayment: (orderId: number, paymentValue: number, paymentMethod: string) =>
    api.patch(`/orders/${orderId}/payment`, {
      paymentValue,
      paymentMethod,
    }),

  delete: (id: number) => api.delete(`/orders/${id}`),
};

export const clientService = {
  getPhonesById: (clientId: number) =>
    api.get<Phone[]>(`/clients/${clientId}/phones`),

  getAll: () => api.get<Client[]>(`/clients`),

  getById: (clientId: number) => api.get<ClientDetail>(`/clients/${clientId}`),
};

export const categoryService = {
  getPricesById: (categoryId: number) =>
    api.get<Price[]>(`/categories/${categoryId}/prices`),
};
