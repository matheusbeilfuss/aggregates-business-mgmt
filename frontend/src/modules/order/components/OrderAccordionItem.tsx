import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { OrderItem, Phone } from "../types";
import { OrderActions } from "./OrderActions";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "../utils/formatTime";
import { useClientsPhones } from "../hooks/useClientsPhones";
import { selectPreferredPhone } from "../utils/selectPreferredPhone";

interface Props {
  order: OrderItem;
}

export function OrderAccordionItem({ order }: Props) {
  const { data: phones } = useClientsPhones(order.client.id.toString());

  const preferredPhone: Phone | null = selectPreferredPhone(phones ?? []);

  const isMaterial = order.type === "MATERIAL";

  const materialLabel = isMaterial
    ? `${order.quantity ?? 0} m³ de ${order.product.name}`
    : order.service;

  return (
    <AccordionItem value={String(order.id)}>
      <AccordionTrigger className="w-full p-4 text-sm">
        <div className="grid w-full grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-4 sm:gap-y-0">
          <span className="font-medium order-1 sm:order-1 sm:col-span-1">
            {order.client.name}
          </span>

          <span className="order-2 text-right sm:order-4 sm:col-span-1 sm:text-right">
            {formatTime(order.scheduledTime)}
          </span>

          <span className="order-3 col-span-2 sm:order-2 sm:col-span-1">
            {order.orderAddress.neighborhood}
          </span>

          <span className="order-4 col-span-2 sm:order-3 sm:col-span-1">
            {materialLabel}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-2 text-sm">
        <Separator />
        <div className="flex flex-col gap-2 p-5 sm:flex-row sm:justify-between">
          <span className="font-medium">R$ {order.orderValue.toFixed(2)}</span>

          <p>
            {order.orderAddress.street}, Nº {order.orderAddress.number}
          </p>

          <p>{order.orderAddress.city}</p>

          <p>{preferredPhone?.number}</p>
        </div>

        {order.observations && (
          <p className="px-5 sm:text-sm break-words">{order.observations}</p>
        )}

        <div className="pt-2 flex justify-end px-5">
          <OrderActions order={order} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
