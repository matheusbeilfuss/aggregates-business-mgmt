import { OrderTypeEnum, PaymentStatusEnum } from "@/types";
import { Payment } from "../types";
import { formatLocalCurrency, formatLocalDate } from "@/utils/";

type PaymentRowLabelProps = {
  payment: Payment;
};

export function PaymentRowLabel({ payment }: PaymentRowLabelProps) {
  const isService = payment.order.type === OrderTypeEnum.SERVICE;

  const description = isService
    ? (payment.order.service ?? `Pedido #${payment.order.id}`)
    : (payment.order.product?.name ?? `Pedido #${payment.order.id}`);

  const quantity =
    !isService && payment.order.m3Quantity != null
      ? `${payment.order.m3Quantity} m³`
      : null;

  const isPaid = payment.order.paymentStatus === PaymentStatusEnum.PAID;
  const isPartial = payment.order.paymentStatus === PaymentStatusEnum.PARTIAL;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 w-full text-sm">
      <span className="font-medium">{payment.order.client.name}</span>

      <span className="text-muted-foreground flex items-center gap-2">
        {description}
        {quantity && (
          <span className="text-xs rounded bg-muted px-2 py-0.5">
            {quantity}
          </span>
        )}
      </span>

      <span className="text-muted-foreground">
        Recebido em {formatLocalDate(payment.date)}
      </span>

      <span className="text-muted-foreground">
        Agendado para {formatLocalDate(payment.order.scheduledDate)}
      </span>

      {isPartial && (
        <span className="text-xs font-medium text-orange-500">
          Parcial · Total {formatLocalCurrency(payment.order.orderValue)}
        </span>
      )}

      {isPaid && (
        <span className="text-xs font-medium text-green-500">
          Pedido quitado
        </span>
      )}
    </div>
  );
}
