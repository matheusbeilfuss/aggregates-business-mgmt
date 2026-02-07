import { Accordion } from "@/components/ui/accordion";
import { OrderItem } from "../types";
import { OrderAccordionItem } from "./OrderAccordionItem";

interface OrderSectionProps {
  title: string;
  orders?: OrderItem[];
}

export function OrderSection({ title, orders }: OrderSectionProps) {
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
          <OrderAccordionItem order={order} />
        </Accordion>
      ))}
    </section>
  );
}
