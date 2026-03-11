import { api } from "@/lib/api";
import { CreateOrderPayload, OrderItem } from "../types";

export const orderService = {
  getByScheduledDate: (scheduledDate: string) =>
    api.get<OrderItem[]>(
      `/orders?scheduledDate=${encodeURIComponent(scheduledDate)}`,
    ),

  getById: (id: number) => api.get<OrderItem>(`/orders/${id}`),

  insert: (data: CreateOrderPayload) => api.post<OrderItem>(`/orders`, data),

  update: (id: number, data: CreateOrderPayload) =>
    api.put<OrderItem>(`/orders/${id}`, data),

  markAsDelivered: (id: number) => api.patch(`/orders/${id}/delivered`, {}),

  delete: (id: number) => api.delete(`/orders/${id}`),
};
