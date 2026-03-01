import { useRef, useState } from "react";
import { toast } from "sonner";
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

  function openDeleteDialog(id: number, name: string) {
    lastCategoryName.current = name;
    setCategoryToDelete({ id, name });
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.id);
      toast.success("Categoria excluída com sucesso.");
      refetch();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível excluir a categoria.");
      }
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
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível renomear a categoria.");
      }
    } finally {
      setCategoryToRename(null);
      setNewName("");
    }
  }

  return (
    <PageContainer title="Preços">
      {error && <p className="text-red-500 mb-4">{error.message}</p>}

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <PriceTable
          prices={prices ?? []}
          onRenameCategory={(id, name) => {
            setCategoryToRename({ id, name });
            setNewName(name);
          }}
          onDeleteCategory={openDeleteDialog}
        />
      )}

      <RenameCategoryDialog
        open={!!categoryToRename}
        currentName={categoryToRename?.name ?? ""}
        newName={newName}
        onNewNameChange={setNewName}
        onConfirm={handleRenameCategory}
        onCancel={() => {
          setCategoryToRename(null);
          setNewName("");
        }}
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
