import { PaymentStatusEnum } from "@/types";

export function getPaymentBorderColor(status: PaymentStatusEnum): string {
  switch (status) {
    case PaymentStatusEnum.PAID:
      return "#22c55e";
    case PaymentStatusEnum.PARTIAL:
      return "#f59e0b";
    default:
      return "var(--color-primary-40)";
  }
}
