import { useState } from "react";
import { MoreHorizontal, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Payment } from "../types";
import { api } from "@/lib/api";
import { formatLocalCurrency } from "@/utils/";
import { formatLocalDate } from "@/utils/";

type Props = {
  payment: Payment;
  onSuccess: () => void;
};

export function PaymentRowActions({ payment, onSuccess }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/payments/${payment.id}`);
      toast.success("A entrada foi excluída com sucesso.");
      onSuccess();
    } catch {
      toast.error("Não foi possível excluir a entrada.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              // navegar para edição — rota a definir
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <X className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Você tem certeza de que deseja excluir a entrada abaixo?"
        description={`${payment.order.client.name} · ${formatLocalCurrency(payment.paymentValue)} · ${formatLocalDate(payment.date)}`}
        onConfirm={handleDelete}
      />
    </>
  );
}
