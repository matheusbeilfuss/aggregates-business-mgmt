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
    <Link to="/orders" className="block">
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow h-full ${className ?? ""}`}
      >
        <CardHeader>
          <CardTitle className="text-base font-medium">Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum pedido para hoje.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
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
                    className="flex flex-col gap-0.5 md:flex-row md:items-center md:justify-between md:gap-4"
                  >
                    <span className="font-semibold text-base truncate">
                      {order.client.name}
                    </span>
                    <div className="flex items-center justify-between gap-2 text-base text-muted-foreground md:justify-start md:shrink-0">
                      <span className="truncate">
                        {[label, quantity, neighborhood]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                      <span className="hidden md:inline text-border">·</span>
                      <span className="font-medium text-foreground shrink-0">
                        {formatTime(order.scheduledTime)}
                      </span>
                    </div>
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
