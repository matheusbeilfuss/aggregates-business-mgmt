import { Receivable } from "../types";
import { OrderTypeEnum, PaymentStatusEnum } from "@/types";
import { formatLocalCurrency, formatLocalDate, formatTime } from "@/utils";
import { ReceivableRowActions } from "./ReceivableRowActions";

type Props = {
  receivable: Receivable;
  onAddPayment: (receivable: Receivable) => void;
};

const statusLabel: Partial<Record<PaymentStatusEnum, string>> = {
  [PaymentStatusEnum.PENDING]: "Pendente",
  [PaymentStatusEnum.PARTIAL]: "Parcial",
};

const statusColor: Partial<Record<PaymentStatusEnum, string>> = {
  [PaymentStatusEnum.PENDING]: "text-orange-500",
  [PaymentStatusEnum.PARTIAL]: "text-yellow-500",
};

export function ReceivableRow({ receivable, onAddPayment }: Props) {
  const label =
    receivable.type === OrderTypeEnum.SERVICE
      ? (receivable.service ?? `Pedido #${receivable.id}`)
      : (receivable.productName ?? `Pedido #${receivable.id}`);

  return (
    <div className="flex flex-col gap-1 px-4 py-3 text-sm border-t md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:gap-x-4 md:items-center">
      <span className="flex items-center gap-2">
        {label}

        <span className="text-xs text-muted-foreground rounded bg-muted px-2 py-0.5 shrink-0">
          #{receivable.id}
        </span>
      </span>

      <span className="text-muted-foreground">
        {formatLocalDate(receivable.scheduledDate)} às{" "}
        {formatTime(receivable.scheduledTime)}
      </span>

      <span className="text-muted-foreground">
        Total: {formatLocalCurrency(receivable.orderValue)}
      </span>

      <span
        className={`font-medium ${statusColor[receivable.paymentStatus] ?? ""}`}
      >
        {statusLabel[receivable.paymentStatus] ?? receivable.paymentStatus} ·{" "}
        {formatLocalCurrency(receivable.remainingValue)} restante
      </span>

      <ReceivableRowActions
        receivable={receivable}
        onAddPayment={onAddPayment}
      />
    </div>
  );
}
