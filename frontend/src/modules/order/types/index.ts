import { Product } from "@/modules/stock/types";

export type OrderType = "MATERIAL" | "SERVICE";
export type OrderStatus = "PENDING" | "DELIVERED";
export type PaymentStatus = "PENDING" | "PARTIAL" | "PAID";
export type PhoneType = "WHATSAPP" | "CELULAR" | "FIXO" | "OUTRO";

export interface Client {
  id: number;
  name: string;
  cpfCnpj: string;
  email: string;
}

export interface ClientDetail extends Client {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  phones: Phone[];
}

export interface Phone {
  id: number;
  client: Client;
  number: string;
  type: PhoneType;
}

export interface Price {
  id: number;
  m3Volume: number;
  price: number;
}

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
}

interface MaterialOrderItem extends BaseOrderItem {
  type: "MATERIAL";

  product: Product;
  quantity: number;

  service: null;
}

interface ServiceOrderItem extends BaseOrderItem {
  type: "SERVICE";

  product: null;
  quantity: null;

  service: string;
}

export type OrderItem = MaterialOrderItem | ServiceOrderItem;

// Payloads para API
export interface CreateOrderPayload {
  productId: number | null;

  clientId: number;
  state: string;
  city: string;
  street: string;
  number: string;
  neighborhood: string;

  quantity?: number;
  service?: string | null;

  type: OrderType;

  scheduledDate: string;
  scheduledTime: string;

  observations: string | null;
  orderValue: number;
}
