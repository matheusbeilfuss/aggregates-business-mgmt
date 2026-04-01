import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Payment } from "../types";
import { api, ApiError } from "@/lib/api";
import { formatLocalCurrency, formatLocalDate } from "@/utils";
import { PaymentDialog } from "@/components/shared/PaymentDialog";

type Props = {
  payment: Payment;
  onSuccess: () => void;
};

export function PaymentRowActions({ payment, onSuccess }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/payments/${payment.id}`);
      toast.success("Entrada excluída com sucesso.");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir a entrada.",
      );
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onSelect={() => setEditOpen(true)}
          >
            <Pencil className="h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PaymentDialog
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        payment={payment}
        onSuccess={onSuccess}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir esta entrada?"
        description={`${payment.order.client.name} · ${formatLocalCurrency(payment.paymentValue)} · ${formatLocalDate(payment.date)}`}
        onConfirm={handleDelete}
      />
    </>
  );
}
