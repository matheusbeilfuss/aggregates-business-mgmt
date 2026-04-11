import { OrderTypeEnum, PaymentStatusEnum } from "@/types";
import { Payment } from "../types";
import { formatLocalCurrency, formatLocalDate } from "@/utils";

type PaymentRowLabelProps = {
  payment: Payment;
};

export function PaymentRowLabel({ payment }: PaymentRowLabelProps) {
  const isService = payment.order.type === OrderTypeEnum.SERVICE;

  const quantity =
    !isService && payment.order.m3Quantity != null
      ? `${payment.order.m3Quantity} m³`
      : null;

  const description = isService
    ? (payment.order.service ?? `Pedido #${payment.order.id}`)
    : quantity && payment.order.product?.name
      ? `${quantity} de ${payment.order.product.name}`
      : `Pedido #${payment.order.id}`;

  const isPaid = payment.order.paymentStatus === PaymentStatusEnum.PAID;
  const isPartial = payment.order.paymentStatus === PaymentStatusEnum.PARTIAL;

  return (
    <div className="flex flex-col gap-1 w-full text-sm md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:gap-x-4 md:items-center">
      <span className="font-medium text-foreground">
        {payment.order.client.name}
      </span>

      <span className="text-muted-foreground flex items-center gap-1.5 flex-wrap">
        {description}
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
          style={{
            backgroundColor: "var(--color-surface-container-high)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          #{payment.order.id}
        </span>
      </span>

      <span className="text-muted-foreground text-xs">
        Recebido em {formatLocalDate(payment.date)}
      </span>

      <span className="text-muted-foreground text-xs">
        Agendado para {formatLocalDate(payment.order.scheduledDate)}
      </span>

      <span className="text-xs font-medium md:text-right shrink-0">
        {isPartial && (
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-secondary-90)",
              color: "var(--color-secondary-40)",
            }}
          >
            Parcial · {formatLocalCurrency(payment.order.orderValue)}
          </span>
        )}
        {isPaid && (
          <span
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
          >
            Quitado
          </span>
        )}
      </span>
    </div>
  );
}
