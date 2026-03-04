export interface ApiErrorResponse {
  message: string;
  status: number;
}

export enum OrderTypeEnum {
  MATERIAL = "MATERIAL",
  SERVICE = "SERVICE",
}

export enum ExpenseTypeEnum {
  FIXED = "FIXED",
  VARIABLE = "VARIABLE",
  FUEL = "FUEL",
}

export enum PaymentMethodEnum {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  CASH = "CASH",
  PIX = "PIX",
  BANK_TRANSFER = "BANK_TRANSFER",
  BANK_SLIP = "BANK_SLIP",
  CHECK = "CHECK",
}

export enum PaymentStatusEnum {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
}
