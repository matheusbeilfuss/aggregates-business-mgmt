import { PaymentStatusEnum } from "@/types";

type StatusStyle = { bg: string; color: string };

export const paymentStatusStyle: Record<PaymentStatusEnum, StatusStyle> = {
  [PaymentStatusEnum.PAID]: {
    bg: "var(--color-success-container)",
    color: "var(--color-success)",
  },
  [PaymentStatusEnum.PARTIAL]: {
    bg: "var(--color-secondary-90)",
    color: "var(--color-secondary-40)",
  },
  [PaymentStatusEnum.PENDING]: {
    bg: "var(--color-tertiary-90)",
    color: "var(--color-tertiary-40)",
  },
};
