import { Receivable } from "../types";
import { OrderTypeEnum } from "@/types";
import {
  formatLocalCurrency,
  formatLocalDate,
  formatTime,
  paymentStatusColor,
  paymentStatusLabel,
} from "@/utils";
import { ReceivableRowActions } from "./ReceivableRowActions";

type Props = {
  receivable: Receivable;
  onAddPayment: (receivable: Receivable) => void;
};

export function ReceivableRow({ receivable, onAddPayment }: Props) {
  const label =
    receivable.type === OrderTypeEnum.SERVICE
      ? (receivable.service ?? `Pedido #${receivable.id}`)
      : (receivable.productName ?? `Pedido #${receivable.id}`);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 items-center px-4 py-3 text-sm border-t md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
      <div className="flex flex-col gap-0.5 md:contents">
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
          className={`font-medium md:text-right ${paymentStatusColor[receivable.paymentStatus] ?? ""}`}
        >
          {paymentStatusLabel[receivable.paymentStatus] ??
            receivable.paymentStatus}{" "}
          · {formatLocalCurrency(receivable.remainingValue)} restante
        </span>
      </div>

      <ReceivableRowActions
        receivable={receivable}
        onAddPayment={onAddPayment}
      />
    </div>
  );
}
