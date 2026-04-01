import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { OrderItem } from "../types";
import { OrderActions } from "./OrderActions";
import { Separator } from "@/components/ui/separator";
import {
  formatCep,
  formatPhone,
  formatTime,
  selectPrimaryPhone,
} from "@/utils";
import { Phone } from "@/modules/client/types";
import {
  getPhoneHref,
  getPhoneLabel,
  getMapsHref,
} from "@/modules/client/utils";
import { MapPin, PhoneCall, Truck, Shovel } from "lucide-react";
import { PaymentBadge } from "./PaymentBadge";

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

  return (
    <AccordionItem value={String(order.id)} className="border-0">
      <AccordionTrigger
        className="w-full px-4 py-3 text-left hover:no-underline
             hover:bg-accent/50 transition-colors [&[data-state=open]]:bg-accent/30
             [&>svg]:self-center"
      >
        <div className="flex w-full items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
              style={{
                backgroundColor: isMaterial
                  ? "var(--color-primary-90)"
                  : "var(--color-secondary-90)",
              }}
            >
              {isMaterial ? (
                <Truck
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--color-primary-40)" }}
                />
              ) : (
                <Shovel
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--color-secondary-40)" }}
                />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-medium text-foreground leading-none">
                  {order.client.name}
                </span>
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: "var(--color-surface-container-high)",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  #{order.id}
                </span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5 truncate">
                {order.orderAddress.neighborhood}
                {isMaterial
                  ? ` · ${order.m3Quantity ?? 0} m³ de ${order.product.name}`
                  : ` · ${order.service}`}
              </span>
            </div>
          </div>

          <span
            className="shrink-0 text-xs font-semibold px-2 py-1 rounded-lg"
            style={{
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            {formatTime(order.scheduledTime)}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-0 pb-0">
        <Separator />

        <div className="px-4 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <p
                className="text-[10px] font-medium uppercase tracking-wide"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Endereço
              </p>
              <a
                href={getMapsHref(order.orderAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-1.5 group"
                onClick={(e) => e.stopPropagation()}
              >
                <MapPin
                  className="h-3.5 w-3.5 mt-0.5 shrink-0 transition-colors
                             group-hover:text-primary"
                  style={{ color: "var(--color-on-surface-variant)" }}
                />
                <div className="text-sm">
                  <p className="group-hover:underline underline-offset-2">
                    {order.orderAddress.street}, Nº {order.orderAddress.number}
                    {order.orderAddress.complement &&
                      `, ${order.orderAddress.complement}`}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {order.orderAddress.neighborhood} —{" "}
                    {order.orderAddress.city}/{order.orderAddress.state}
                    {order.orderAddress.cep &&
                      ` (${formatCep(order.orderAddress.cep)})`}
                  </p>
                </div>
              </a>
            </div>

            <div className="space-y-1">
              <p
                className="text-[10px] font-medium uppercase tracking-wide"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Contato
              </p>
              {primaryPhone ? (
                <a
                  href={getPhoneHref(primaryPhone)}
                  target={
                    primaryPhone.type === "WHATSAPP" ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PhoneCall
                    className="h-3.5 w-3.5 shrink-0 transition-colors
                               group-hover:text-primary"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  />
                  <span className="group-hover:underline underline-offset-2">
                    {formatPhone(primaryPhone.number)}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        primaryPhone.type === "WHATSAPP"
                          ? "#dcfce7"
                          : "var(--color-surface-container-high)",
                      color:
                        primaryPhone.type === "WHATSAPP"
                          ? "#15803d"
                          : "var(--color-on-surface-variant)",
                    }}
                  >
                    {getPhoneLabel(primaryPhone)}
                  </span>
                </a>
              ) : (
                <div className="flex items-center gap-1.5 text-sm">
                  <PhoneCall
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  />
                  <span className="text-muted-foreground">Não cadastrado</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p
                className="text-[10px] font-medium uppercase tracking-wide"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Valor
              </p>
              <p className="text-sm font-semibold text-foreground">
                R$ {order.orderValue.toFixed(2)}
              </p>
            </div>

            {isMaterial && order.tonQuantity != null && (
              <div className="space-y-1">
                <p
                  className="text-[10px] font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Quantidade
                </p>
                <p className="text-sm">
                  {order.m3Quantity} m³ ·{" "}
                  <span className="text-muted-foreground">
                    {order.tonQuantity.toFixed(2)} ton
                  </span>
                </p>
              </div>
            )}
          </div>

          {order.observations && (
            <div
              className="rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: "var(--color-surface-container-low)" }}
            >
              {order.observations}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <PaymentBadge status={order.paymentStatus} />
            <OrderActions
              order={order}
              onMarkAsDelivered={onMarkAsDelivered}
              onAddPayment={onAddPayment}
              onDeleteOrder={onDeleteOrder}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
