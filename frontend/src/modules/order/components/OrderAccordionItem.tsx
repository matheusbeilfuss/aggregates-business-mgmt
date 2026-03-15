import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { OrderItem } from "../types";
import { OrderActions } from "./OrderActions";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/utils";
import { selectPrimaryPhone } from "@/utils";
import { Phone } from "@/modules/client/types";

interface OrderAccordionItemProps {
  order: OrderItem;
  onMarkAsDelivered?: (order: OrderItem) => void;
  onAddPayment?: (order: OrderItem) => void;
  onDeleteOrder?: (order: OrderItem) => void;
}

export function OrderAccordionItem({
  order,
  onMarkAsDelivered,
  onAddPayment,
  onDeleteOrder,
}: OrderAccordionItemProps) {
  const primaryPhone: Phone | null = selectPrimaryPhone(
    order.client.phones ?? [],
  );

  const isMaterial = order.type === "MATERIAL";

  const materialLabel = isMaterial ? (
    <span className="flex items-center gap-2">
      {`${order.m3Quantity ?? 0} m³ de ${order.product.name}`}
      {order.product.category?.name && (
        <span className="text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground">
          {order.product.category.name}
        </span>
      )}
    </span>
  ) : (
    order.service
  );

  return (
    <AccordionItem value={String(order.id)}>
      <AccordionTrigger className="w-full p-4 text-sm">
        <div className="grid w-full grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-4 sm:gap-y-0">
          <span className="font-medium order-1 sm:order-1 sm:col-span-1 flex items-center gap-2">
            {order.client.name}

            <span className="text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground">
              #{order.id}
            </span>
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
          <p>{primaryPhone?.number || "Telefone não cadastrado"}</p>
          {isMaterial && order.tonQuantity != null && (
            <p>
              {order.m3Quantity} m³ · {order.tonQuantity.toFixed(2)} ton
            </p>
          )}
        </div>

        {order.observations && (
          <p className="px-5 sm:text-sm break-words">{order.observations}</p>
        )}

        <div className="pt-2 flex justify-end px-5">
          <OrderActions
            order={order}
            onMarkAsDelivered={onMarkAsDelivered}
            onAddPayment={onAddPayment}
            onDeleteOrder={onDeleteOrder}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
