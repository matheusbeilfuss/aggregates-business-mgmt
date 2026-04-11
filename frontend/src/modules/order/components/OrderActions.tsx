import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  DollarSign,
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { OrderItem } from "../types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrderActionsProps {
  order: OrderItem;
  onMarkAsDelivered?: (order: OrderItem) => void;
  onAddPayment?: (order: OrderItem) => void;
  onDeleteOrder?: (order: OrderItem) => void;
}

export function OrderActions({
  order,
  onMarkAsDelivered,
  onAddPayment,
  onDeleteOrder,
}: OrderActionsProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onSelect={() => navigate(`/orders/${order.id}`)}
        >
          <Pencil className="h-4 w-4" />
          Editar
        </DropdownMenuItem>

        {order.status === "PENDING" && onMarkAsDelivered && (
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onSelect={() => onMarkAsDelivered(order)}
          >
            <Check className="h-4 w-4" />
            Marcar como entregue
          </DropdownMenuItem>
        )}

        {onAddPayment &&
          (order.paymentStatus === "PENDING" ||
            order.paymentStatus === "PARTIAL") && (
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={() => onAddPayment(order)}
            >
              <DollarSign className="h-4 w-4" />
              Adicionar pagamento
            </DropdownMenuItem>
          )}

        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onSelect={() => navigate(`/clients?id=${order.client.id}`)}
        >
          <User className="h-4 w-4" />
          Ver cliente
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          onSelect={() => onDeleteOrder && onDeleteOrder(order)}
        >
          <Trash2 className="text-destructive h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
