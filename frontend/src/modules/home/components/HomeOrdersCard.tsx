import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderItem } from "@/modules/order/types";
import { formatTime } from "@/utils";
import { Link } from "react-router-dom";

type Props = {
  orders: OrderItem[];
  loading: boolean;
  className?: string;
};

export function HomeOrdersCard({ orders, loading, className }: Props) {
  return (
    <Link to="/orders" className="block h-full">
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow h-full ${className ?? ""}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Pedidos de hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Carregando...
            </p>
          ) : orders.length === 0 ? (
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Nenhum pedido para hoje.
            </p>
          ) : (
            <ul
              className="flex flex-col divide-y"
              style={{ borderColor: "var(--color-outline-variant)" }}
            >
              {orders.map((order) => {
                const label = order.product
                  ? order.product.name
                  : (order.service ?? "Serviço");
                const quantity =
                  order.m3Quantity != null ? `${order.m3Quantity} m³` : null;
                const neighborhood = order.orderAddress?.neighborhood ?? null;

                return (
                  <li
                    key={order.id}
                    className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-semibold text-sm truncate"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {order.client.name}
                      </span>
                      <span
                        className="text-sm font-medium shrink-0 tabular-nums"
                        style={{ color: "var(--color-primary-40)" }}
                      >
                        {formatTime(order.scheduledTime)}
                      </span>
                    </div>
                    <span
                      className="text-xs truncate"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      {[label, quantity, neighborhood]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
