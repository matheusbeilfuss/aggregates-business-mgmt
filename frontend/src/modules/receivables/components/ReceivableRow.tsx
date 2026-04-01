import { Receivable } from "../types";
import { OrderTypeEnum } from "@/types";
import {
  formatLocalCurrency,
  formatLocalDate,
  formatTime,
  paymentStatusLabel,
} from "@/utils";
import { ReceivableRowActions } from "./ReceivableRowActions";

type Props = {
  receivable: Receivable;
  onAddPayment: (receivable: Receivable) => void;
};

function getStatusStyle(status: string) {
  if (status === "PARTIAL") {
    return {
      bg: "var(--color-secondary-90)",
      color: "var(--color-secondary-40)",
    };
  }
  return {
    bg: "var(--color-tertiary-90)",
    color: "var(--color-tertiary-40)",
  };
}

export function ReceivableRow({ receivable, onAddPayment }: Props) {
  const label =
    receivable.type === OrderTypeEnum.SERVICE
      ? (receivable.service ?? `Pedido #${receivable.id}`)
      : (receivable.productName ?? `Pedido #${receivable.id}`);

  const statusStyle = getStatusStyle(receivable.paymentStatus);

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 text-sm
                 hover:bg-accent/50 transition-colors"
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0 md:grid md:grid-cols-[1fr_1fr_1fr_auto] md:gap-x-4 md:items-center">
        <span className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-foreground">{label}</span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
            style={{
              backgroundColor: "var(--color-surface-container-high)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            #{receivable.id}
          </span>
        </span>

        <span className="text-xs text-muted-foreground">
          {formatLocalDate(receivable.scheduledDate)} às{" "}
          {formatTime(receivable.scheduledTime)}
        </span>

        <span className="text-xs text-muted-foreground">
          Total: {formatLocalCurrency(receivable.orderValue)}
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {paymentStatusLabel[receivable.paymentStatus] ??
              receivable.paymentStatus}
          </span>
          <span
            className="text-xs font-medium tabular-nums"
            style={{ color: statusStyle.color }}
          >
            {formatLocalCurrency(receivable.remainingValue)} restante
          </span>
        </div>
      </div>

      <ReceivableRowActions
        receivable={receivable}
        onAddPayment={onAddPayment}
      />
    </div>
  );
}
