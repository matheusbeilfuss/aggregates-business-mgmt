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
  User,
  X,
} from "lucide-react";
import { OrderItem } from "../types";
import { useNavigate } from "react-router";

interface OrderActionsProps {
  order: OrderItem;
  onMarkAsDelivered?: (order: OrderItem) => void;
  onAddPayment?: (order: OrderItem) => void;
}

export function OrderActions({
  order,
  onMarkAsDelivered,
  onAddPayment,
}: OrderActionsProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            navigate(`/orders/${order.id}`);
          }}
        >
          <Pencil className="h-4 w-4" />
          Editar
        </DropdownMenuItem>

        {order.status === "PENDING" && onMarkAsDelivered && (
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onMarkAsDelivered(order)}
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
              onClick={() => onAddPayment(order)}
            >
              <DollarSign className="h-4 w-4" />
              Adicionar pagamento
            </DropdownMenuItem>
          )}

        <DropdownMenuItem className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Cliente
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 text-destructive">
          <X className="h-4 w-4 text-destructive" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
