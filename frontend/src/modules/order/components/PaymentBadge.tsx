import { PaymentStatusEnum } from "@/types";
import { paymentStatusLabel, paymentStatusStyle } from "@/utils";

export function PaymentBadge({ status }: { status?: PaymentStatusEnum }) {
  const resolvedStatus = status ?? PaymentStatusEnum.PENDING;
  const style = paymentStatusStyle[resolvedStatus];
  const label = paymentStatusLabel[resolvedStatus];

  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {label}
    </span>
  );
}
