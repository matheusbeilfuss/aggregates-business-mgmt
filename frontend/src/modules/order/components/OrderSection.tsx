import { Accordion } from "@/components/ui/accordion";
import { OrderItem } from "../types";
import { OrderAccordionItem } from "./OrderAccordionItem";
import { ClipboardX } from "lucide-react";
import { getPaymentBorderColor } from "../utils/getPaymentBorderColor";

interface OrderSectionProps {
  title: string;
  orders?: OrderItem[];
  emptyMessage?: string;
  onMarkAsDelivered?: (order: OrderItem) => void;
  onAddPayment?: (order: OrderItem) => void;
  onDeleteOrder?: (order: OrderItem) => void;
}

export function OrderSection({
  title,
  orders,
  emptyMessage = "Nenhum pedido encontrado.",
  onMarkAsDelivered,
  onAddPayment,
  onDeleteOrder,
}: OrderSectionProps) {
  const count = orders?.length ?? 0;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2.5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <span
          className="inline-flex items-center justify-center min-w-[1.25rem] h-5
                     px-1.5 rounded-full text-[11px] font-semibold"
          style={{
            backgroundColor:
              count > 0
                ? "var(--color-primary-90)"
                : "var(--color-surface-container-high)",
            color:
              count > 0
                ? "var(--color-primary-10)"
                : "var(--color-on-surface-variant)",
          }}
        >
          {count}
        </span>
      </div>

      {count === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border border-dashed"
          style={{ borderColor: "var(--color-outline-variant)" }}
        >
          <ClipboardX
            className="h-5 w-5"
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <p
            className="text-sm"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders!.map((order) => (
            <Accordion
              key={order.id}
              type="single"
              collapsible
              className="rounded-xl border bg-card overflow-hidden"
              style={{
                borderLeftWidth: "3px",
                borderLeftColor: getPaymentBorderColor(order.paymentStatus),
              }}
            >
              <OrderAccordionItem
                order={order}
                onMarkAsDelivered={onMarkAsDelivered}
                onAddPayment={onAddPayment}
                onDeleteOrder={onDeleteOrder}
              />
            </Accordion>
          ))}
        </div>
      )}
    </section>
  );
}
