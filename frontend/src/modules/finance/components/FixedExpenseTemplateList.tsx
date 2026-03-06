import { useRef, useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FixedExpense } from "../types";
import { api, ApiError } from "@/lib/api";
import { formatLocalCurrency } from "@/utils/";
import { AddFixedExpenseDialog } from "./AddFixedExpenseDialog";

type Props = {
  templates: FixedExpense[];
  selectedId: number | null;
  onSelect: (template: FixedExpense) => void;
  onRefetch: () => void;
};

export function FixedExpenseTemplateList({
  templates,
  selectedId,
  onSelect,
  onRefetch,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [toEdit, setToEdit] = useState<FixedExpense | null>(null);
  const [toDelete, setToDelete] = useState<FixedExpense | null>(null);
  const lastToDelete = useRef<FixedExpense | null>(null);
  const lastToEdit = useRef<FixedExpense | null>(null);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/fixed-expenses/${toDelete.id}`);
      toast.success("A despesa fixa foi excluída com sucesso.");
      onRefetch();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível excluir a despesa fixa.");
      }
    } finally {
      setToDelete(null);
    }
  };

  const deleteDescription = lastToDelete.current
    ? `${lastToDelete.current.name} · ${formatLocalCurrency(lastToDelete.current.defaultValue)} · ${lastToDelete.current.category}`
    : "";

  return (
    <div className="flex flex-col gap-2 h-full">
      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Despesas fixas cadastradas
      </span>
      <div className="flex-1 border rounded-md divide-y overflow-y-auto min-h-0">
        {templates.length === 0 && (
          <p className="text-sm text-muted-foreground p-3">
            Nenhuma despesa fixa cadastrada.
          </p>
        )}
        {templates.map((t) => (
          <div
            key={t.id}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedId === t.id ? "bg-muted" : ""
            }`}
            onClick={() => onSelect(t)}
          >
            <span className="text-sm">
              {t.name}
              {t.category && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {t.category}
                </span>
              )}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {formatLocalCurrency(t.defaultValue)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      lastToEdit.current = t;
                      setToEdit(t);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      lastToDelete.current = t;
                      setToDelete(t);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova despesa fixa
        </Button>
      </div>

      <AddFixedExpenseDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={onRefetch}
      />

      <AddFixedExpenseDialog
        open={!!toEdit}
        onOpenChange={(open) => !open && setToEdit(null)}
        onSuccess={onRefetch}
        initialValues={lastToEdit.current ?? undefined}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Tem certeza que deseja remover a despesa fixa abaixo?"
        description={deleteDescription}
        onConfirm={handleDelete}
        variant="destructive"
        confirmLabel="Remover"
      />
    </div>
  );
}
