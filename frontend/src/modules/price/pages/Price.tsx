import { useRef, useState } from "react";
import { toast } from "sonner";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePrices } from "../hooks/usePrices";
import {
  LoadingState,
  PageContainer,
  ConfirmDialog,
} from "@/components/shared";
import { PriceTable } from "../components/PriceTable";
import { ApiError } from "@/lib/api";
import { categoryService } from "@/modules/category/services/category.service";
import { RenameCategoryDialog } from "../components/RenameCategoryDialog";

export function Price() {
  usePageTitle("Preços");

  const { data: prices, loading, error, refetch } = usePrices();
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [categoryToRename, setCategoryToRename] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [newName, setNewName] = useState("");
  const lastCategoryName = useRef<string>("");
  const lastCategoryToRename = useRef<{ id: number; name: string } | null>(
    null,
  );

  function openDeleteDialog(id: number, name: string) {
    lastCategoryName.current = name;
    setCategoryToDelete({ id, name });
  }

  function openRenameDialog(id: number, name: string) {
    lastCategoryToRename.current = { id, name };
    setCategoryToRename({ id, name });
    setNewName(name);
  }

  function cancelRename() {
    setCategoryToRename(null);
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.id);
      toast.success("Categoria excluída com sucesso.");
      refetch();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir a categoria.",
      );
    } finally {
      setCategoryToDelete(null);
    }
  }

  async function handleRenameCategory() {
    if (!categoryToRename || !newName.trim()) return;
    try {
      await categoryService.update(categoryToRename.id, {
        name: newName.trim(),
      });
      toast.success("Categoria renomeada com sucesso.");
      refetch();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível renomear a categoria.",
      );
    } finally {
      setCategoryToRename(null);
      setNewName("");
    }
  }

  return (
    <PageContainer
      title="Preços"
      actions={
        <Button
          variant="outline"
          className="h-9 px-4 text-sm gap-1.5"
          onClick={() =>
            window.open("/prices/print", "_blank", "noopener,noreferrer")
          }
        >
          <Printer className="h-4 w-4" />
          Imprimir tabela
        </Button>
      }
    >
      {error && (
        <p className="text-sm text-destructive mb-4">{error.message}</p>
      )}

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <PriceTable
          prices={prices ?? []}
          onRenameCategory={openRenameDialog}
          onDeleteCategory={openDeleteDialog}
        />
      )}

      <RenameCategoryDialog
        open={!!categoryToRename}
        currentName={lastCategoryToRename.current?.name ?? ""}
        newName={newName}
        onNewNameChange={setNewName}
        onConfirm={handleRenameCategory}
        onCancel={cancelRename}
      />

      <ConfirmDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        title={`Excluir a categoria "${lastCategoryName.current}"?`}
        description="Esta ação é irreversível. Os preços associados a esta categoria serão excluídos permanentemente. A exclusão será bloqueada se houver fornecedores, produtos ou pedidos vinculados."
        descriptionAlign="left"
        onConfirm={handleDeleteCategory}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
