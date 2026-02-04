import { Product } from "@/modules/stock/types";

export type OrderType = "MATERIAL" | "SERVICE";
export type OrderStatus = "PENDING" | "DELIVERED";
export type PaymentStatus = "PENDING" | "PAID";

export interface Client {
  id: number;
  name: string;
  cpfCnpj: string;
  email: string;
}

export interface OrderAddress {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  client: Client;
  orderAddress: OrderAddress;

  quantity: number | null;
  service: string | null;

  type: OrderType;

  scheduledDate: string;
  scheduledTime: string;

  observations: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderValue: number;
}
