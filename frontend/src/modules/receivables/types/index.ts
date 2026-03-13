import { OrderTypeEnum, PaymentStatusEnum } from "@/types";

export type Receivable = {
  id: number;
  clientName: string;
  type: OrderTypeEnum;
  productName: string | null;
  service: string | null;
  scheduledDate: string;
  scheduledTime: string;
  orderValue: number;
  remainingValue: number;
  paymentStatus: PaymentStatusEnum;
};

export type ReceivableGroup = {
  clientName: string;
  total: number;
  oldestDate: string;
  items: Receivable[];
};
