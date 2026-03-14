import { DollarSign, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Receivable } from "../types";

type Props = {
  receivable: Receivable;
  onAddPayment: (receivable: Receivable) => void;
};

export function ReceivableRowActions({ receivable, onAddPayment }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAddPayment(receivable)}>
          <DollarSign className="h-4 w-4" />
          Adicionar pagamento
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
