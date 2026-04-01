import { PaymentMethodEnum, PaymentStatusEnum } from "@/types";

export const paymentMethodLabel: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.PIX]: "Pix",
  [PaymentMethodEnum.BANK_TRANSFER]: "Transferência bancária",
  [PaymentMethodEnum.CASH]: "Dinheiro",
  [PaymentMethodEnum.CHECK]: "Cheque",
  [PaymentMethodEnum.CREDIT_CARD]: "Cartão de Crédito",
  [PaymentMethodEnum.DEBIT_CARD]: "Cartão de Débito",
  [PaymentMethodEnum.BANK_SLIP]: "Boleto",
};

export const paymentStatusLabel: Record<PaymentStatusEnum, string> = {
  [PaymentStatusEnum.PENDING]: "Pendente",
  [PaymentStatusEnum.PARTIAL]: "Parcial",
  [PaymentStatusEnum.PAID]: "Pago",
};
