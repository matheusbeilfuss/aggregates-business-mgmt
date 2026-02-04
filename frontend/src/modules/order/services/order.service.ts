import { api } from "@/lib/api";
import { OrderItem, Phone } from "../types";

export const orderService = {
  getByScheduledDate: (scheduledDate: string) =>
    api.get<OrderItem[]>(`/orders?scheduledDate=${scheduledDate}`),

  getPhonesByClientId: (clientId: number) =>
    api.get<Phone[]>(`/clients/${clientId}/phones`),
};
