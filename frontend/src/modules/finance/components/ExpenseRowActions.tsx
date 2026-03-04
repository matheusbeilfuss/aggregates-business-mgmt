import { useState } from "react";
import { MoreHorizontal, Pencil, X, DollarSign } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Expense } from "../types";
import { PaymentStatusEnum } from "@/types";
import { api } from "@/lib/api";
import { formatLocalCurrency } from "@/utils";

type Props = {
  expense: Expense;
  onSuccess: () => void;
  showMarkAsPaid: boolean;
};

export function ExpenseRowActions({
  expense,
  onSuccess,
  showMarkAsPaid,
}: Props) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmPaidOpen, setConfirmPaidOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${expense.id}`);
      toast.success("Saída removida.");
      onSuccess();
    } catch {
      toast.error("Erro ao remover saída.");
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await api.put(`/expenses/${expense.id}`, {
        ...expense,
        paymentStatus: PaymentStatusEnum.PAID,
        paymentDate: new Date().toISOString().split("T")[0],
      });
      toast.success("Despesa marcada como paga.");
      onSuccess();
    } catch {
      toast.error("Erro ao atualizar despesa.");
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
          {showMarkAsPaid && (
            <DropdownMenuItem onClick={() => setConfirmPaidOpen(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              Marcar como paga
            </DropdownMenuItem>
          )}
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
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <X className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Você tem certeza de que deseja excluir a saída abaixo?"
        description={`${expense.name} · ${formatLocalCurrency(expense.expenseValue)}`}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={confirmPaidOpen}
        onOpenChange={setConfirmPaidOpen}
        title="Você tem certeza de que deseja marcar a saída abaixo como paga?"
        description={`${expense.name} · ${formatLocalCurrency(expense.expenseValue)}`}
        onConfirm={handleMarkAsPaid}
        variant="default"
      />
    </>
  );
}
