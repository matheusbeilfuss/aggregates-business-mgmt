import { useState } from "react";
import { MoreHorizontal, Pencil, DollarSign, Trash2 } from "lucide-react";
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
import { Expense } from "../types";
import { api, ApiError } from "@/lib/api";
import { formatLocalCurrency } from "@/utils";
import { useNavigate } from "react-router-dom";
import { expenseService } from "../services/expense.service";

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
  const navigate = useNavigate();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmPaidOpen, setConfirmPaidOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${expense.id}`);
      toast.success("Saída excluída com sucesso.");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir a saída.",
      );
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await expenseService.markAsPaid(expense.id);
      toast.success("Despesa marcada como paga.");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível marcar a despesa como paga.",
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
        <DropdownMenuContent align="end" className="w-44">
          {showMarkAsPaid && (
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={() => setConfirmPaidOpen(true)}
            >
              <DollarSign className="h-4 w-4" />
              Marcar como paga
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onSelect={() => navigate(`/finance/expenses/${expense.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onSelect={() => setConfirmDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Excluir esta saída?"
        description={`${expense.name} · ${formatLocalCurrency(expense.expenseValue)}`}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={confirmPaidOpen}
        onOpenChange={setConfirmPaidOpen}
        title="Marcar esta saída como paga?"
        description={`${expense.name} · ${formatLocalCurrency(expense.expenseValue)}`}
        onConfirm={handleMarkAsPaid}
        variant="default"
      />
    </>
  );
}
