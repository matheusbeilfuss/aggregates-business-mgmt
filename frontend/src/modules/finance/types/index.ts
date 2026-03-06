import { OrderItem } from "@/modules/order/types";
import { ExpenseTypeEnum, PaymentMethodEnum, PaymentStatusEnum } from "@/types";

export type Expense = {
  id: number;
  name: string;
  expenseValue: number;
  date: string;
  dueDate: string | null;
  paymentDate: string | null;
  type: ExpenseTypeEnum;
  paymentStatus: PaymentStatusEnum;
  category: string;

  vehicle: string | null;
  kmDriven: number | null;
  liters: number | null;
  pricePerLiter: number | null;
  fuelSupplier: string | null;
};

export type ExpenseInputDTO = {
  name: string;
  expenseValue: number;
  date: string;
  dueDate: string | null;
  paymentDate: string | null;
  type: ExpenseTypeEnum;
  paymentStatus: PaymentStatusEnum;
  category: string | null;
  vehicle: string | null;
  kmDriven: number | null;
  liters: number | null;
  pricePerLiter: number | null;
  fuelSupplier: string | null;
};

export type FixedExpense = {
  id: number;
  name: string;
  defaultValue: number;
  category: string | null;
};

export type Payment = {
  id: number;
  order: OrderItem;
  paymentValue: number;
  date: string;
  paymentMethod: PaymentMethodEnum;
};

export type PaymentInputDTO = {
  paymentValue: number;
  paymentMethod: PaymentMethodEnum;
};

export type PaymentInsertDTO = PaymentInputDTO & {
  orderId: number;
};

export type GroupedPayments = Record<string, Payment[]>;
export type GroupedExpenses = Record<string, Expense[]>;
