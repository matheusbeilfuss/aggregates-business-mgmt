import { useRef, useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FixedExpense } from "../types";
import { api, ApiError } from "@/lib/api";
import { formatLocalCurrency } from "@/utils";
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
      toast.success("Despesa fixa excluída com sucesso.");
      onRefetch();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir a despesa fixa.",
      );
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex-1 rounded-xl border overflow-y-auto min-h-0 bg-background">
        {templates.length === 0 ? (
          <p
            className="text-sm p-4 text-center"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Nenhuma despesa fixa cadastrada.
          </p>
        ) : (
          <div className="divide-y">
            {templates.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between px-3 py-2.5
                           cursor-pointer transition-colors"
                style={{
                  backgroundColor:
                    selectedId === t.id ? "var(--color-primary-90)" : undefined,
                }}
                onClick={() => onSelect(t)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-sm font-medium truncate"
                    style={{
                      color:
                        selectedId === t.id
                          ? "var(--color-primary-10)"
                          : undefined,
                    }}
                  >
                    {t.name}
                  </span>
                  {t.category && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        backgroundColor:
                          selectedId === t.id
                            ? "var(--color-primary-40)"
                            : "var(--color-surface-container-high)",
                        color:
                          selectedId === t.id
                            ? "#fff"
                            : "var(--color-on-surface-variant)",
                      }}
                    >
                      {t.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-xs tabular-nums"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {formatLocalCurrency(t.defaultValue)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          lastToEdit.current = t;
                          setToEdit(t);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-destructive
                                   focus:text-destructive focus:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          lastToDelete.current = t;
                          setToDelete(t);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs cursor-pointer"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Nova despesa fixa
        </Button>
      </div>

      <AddFixedExpenseDialog
        key={addOpen ? "add-open" : "add-closed"}
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={onRefetch}
      />

      <AddFixedExpenseDialog
        key={toEdit?.id ?? "edit-closed"}
        open={!!toEdit}
        onOpenChange={(open) => !open && setToEdit(null)}
        onSuccess={onRefetch}
        initialValues={lastToEdit.current ?? undefined}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Remover esta despesa fixa?"
        description={
          lastToDelete.current
            ? `${lastToDelete.current.name} · ${formatLocalCurrency(lastToDelete.current.defaultValue)}`
            : ""
        }
        onConfirm={handleDelete}
        variant="destructive"
        confirmLabel="Remover"
      />
    </div>
  );
}
