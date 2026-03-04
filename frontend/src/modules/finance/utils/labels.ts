import { PaymentMethodEnum, ExpenseTypeEnum } from "@/types";

export const paymentMethodLabel: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.PIX]: "Pix",
  [PaymentMethodEnum.BANK_TRANSFER]: "Transferência",
  [PaymentMethodEnum.CASH]: "Dinheiro",
  [PaymentMethodEnum.CHECK]: "Cheque",
  [PaymentMethodEnum.CREDIT_CARD]: "Cartão de Crédito",
  [PaymentMethodEnum.DEBIT_CARD]: "Cartão de Débito",
  [PaymentMethodEnum.BANK_SLIP]: "Boleto",
};

export const expenseTypeLabel: Record<ExpenseTypeEnum, string> = {
  [ExpenseTypeEnum.VARIABLE]: "Variáveis",
  [ExpenseTypeEnum.FIXED]: "Fixas",
  [ExpenseTypeEnum.FUEL]: "Combustível",
};
