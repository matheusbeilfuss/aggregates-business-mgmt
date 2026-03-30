export function getPaymentBorderColor(paymentStatus?: string): string {
  if (paymentStatus === "PAID") return "#22c55e";
  if (paymentStatus === "PARTIAL") return "#f59e0b";
  return "var(--color-primary-40)";
}
