import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
        <Button type="button" variant="ghost">
          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={() => {
            navigate(`/orders/${order.id}`);
          }}
        >
          <Pencil className="h-4 w-4" />
          Editar
        </DropdownMenuItem>

        {order.status === "PENDING" && onMarkAsDelivered && (
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
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
              className="flex items-center gap-2 cursor-pointer"
              onSelect={() => onAddPayment(order)}
            >
              <DollarSign className="h-4 w-4" />
              Adicionar pagamento
            </DropdownMenuItem>
          )}

        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={() => navigate(`/clients?id=${order.client.id}`)}
        >
          <User className="h-4 w-4" />
          Cliente
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 text-destructive"
          onSelect={() => onDeleteOrder && onDeleteOrder(order)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
