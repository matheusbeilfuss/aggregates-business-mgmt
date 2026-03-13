import { Client } from "@/modules/client/types";
import { Product } from "@/modules/product/types";

export type OrderType = "MATERIAL" | "SERVICE";
export type OrderStatus = "PENDING" | "DELIVERED";
export type PaymentStatus = "PENDING" | "PARTIAL" | "PAID";

export interface OrderAddress {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface BaseOrderItem {
  id: number;
  client: Client;
  orderAddress: OrderAddress;

  scheduledDate: string;
  scheduledTime: string;

  observations: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderValue: number;
  remainingValue: number;
}

interface MaterialOrderItem extends BaseOrderItem {
  type: "MATERIAL";
  product: Product;
  m3Quantity: number;
  tonQuantity: number;
  service: null;
}

interface ServiceOrderItem extends BaseOrderItem {
  type: "SERVICE";
  product: null;
  m3Quantity: null;
  tonQuantity: null;
  service: string;
}

export type OrderItem = MaterialOrderItem | ServiceOrderItem;

export type OrderForPayment = {
  id: number;
  client: { name: string };
  product: { name: string } | null;
  service: string | null;
  scheduledDate: string;
  scheduledTime: string;
  orderValue: number;
  remainingValue: number;
};

// Payloads para API

export interface CreateOrderPayload {
  productId: number | null;

  clientId: number;
  state: string;
  city: string;
  street: string;
  number: string;
  neighborhood: string;

  m3Quantity?: number;
  service?: string | null;

  type: OrderType;

  scheduledDate: string;
  scheduledTime: string;

  observations: string | null;
  orderValue: number;
}
