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

interface Props {
  order: OrderItem;
}

export function OrderActions({ order }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Editar
        </DropdownMenuItem>

        {order.status === "PENDING" && (
          <DropdownMenuItem className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Marcar como entregue
          </DropdownMenuItem>
        )}

        {order.paymentStatus === "PENDING" && (
          <DropdownMenuItem className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Marcar como pago
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
