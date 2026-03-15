import type { ExpenseTypeEnum, PaymentStatusEnum } from "@/types";

export type FuelData = {
  vehicle: string | null;
  kmDriven: number | null;
  liters: number | null;
  pricePerLiter: number | null;
  fuelSupplier: string | null;
};

export type FuelExpense = {
  id: number;
  name: string;
  expenseValue: number;
  date: string;
  dueDate: string | null;
  paymentDate: string | null;
  paymentStatus: PaymentStatusEnum;
  category: string;
  type: ExpenseTypeEnum.FUEL;
} & FuelData;
