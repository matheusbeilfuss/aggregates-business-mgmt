import { Receivable } from "../types";
import { OrderTypeEnum, PaymentStatusEnum } from "@/types";
import { formatLocalCurrency, formatLocalDate, formatTime } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  receivable: Receivable;
  onAddPayment: (receivable: Receivable) => void;
};

const statusLabel: Record<PaymentStatusEnum, string> = {
  [PaymentStatusEnum.PENDING]: "Pendente",
  [PaymentStatusEnum.PARTIAL]: "Parcial",
  [PaymentStatusEnum.PAID]: "Pago",
};

const statusColor: Record<PaymentStatusEnum, string> = {
  [PaymentStatusEnum.PENDING]: "text-orange-500",
  [PaymentStatusEnum.PARTIAL]: "text-yellow-500",
  [PaymentStatusEnum.PAID]: "text-green-500",
};

export function ReceivableRow({ receivable, onAddPayment }: Props) {
  const label =
    receivable.type === OrderTypeEnum.SERVICE
      ? (receivable.service ?? `Pedido #${receivable.id}`)
      : (receivable.productName ?? `Pedido #${receivable.id}`);

  return (
    <div className="flex flex-col gap-1 px-4 py-3 text-sm border-t md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:gap-x-4 md:items-center">
      <span className="font-medium">
        #{receivable.id} · {label}
      </span>

      <span className="text-muted-foreground">
        {formatLocalDate(receivable.scheduledDate)} às{" "}
        {formatTime(receivable.scheduledTime)}
      </span>

      <span className="text-muted-foreground">
        Total: {formatLocalCurrency(receivable.orderValue)}
      </span>

      <span className={`font-medium ${statusColor[receivable.paymentStatus]}`}>
        {statusLabel[receivable.paymentStatus]} ·{" "}
        {formatLocalCurrency(receivable.remainingValue)} restante
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAddPayment(receivable)}
      >
        <Plus className="h-4 w-4 mr-1" />
        Pagamento
      </Button>
    </div>
  );
}
