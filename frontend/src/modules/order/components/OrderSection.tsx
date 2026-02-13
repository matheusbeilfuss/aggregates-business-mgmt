import { Accordion } from "@/components/ui/accordion";
import { OrderItem } from "../types";
import { OrderAccordionItem } from "./OrderAccordionItem";

interface OrderSectionProps {
  title: string;
  orders?: OrderItem[];
  onMarkAsDelivered?: (order: OrderItem) => void;
  onAddPayment?: (order: OrderItem) => void;
  onDeleteOrder?: (order: OrderItem) => void;
}

export function OrderSection({
  title,
  orders,
  onMarkAsDelivered,
  onAddPayment,
  onDeleteOrder,
}: OrderSectionProps) {
  if (!orders || orders.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-medium  mb-2">{title}</h2>
        <p className="text-sm ">Nenhum pedido encontrado.</p>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium  mb-2">{title}</h2>

      {orders.map((order) => (
        <Accordion
          key={order.id}
          type="single"
          collapsible
          className="rounded-lg border"
        >
          <OrderAccordionItem
            order={order}
            onMarkAsDelivered={onMarkAsDelivered}
            onAddPayment={onAddPayment}
            onDeleteOrder={onDeleteOrder}
          />
        </Accordion>
      ))}
    </section>
  );
}
