import { useState } from "react";
import { toast } from "sonner";

import {
  PageContainer,
  LoadingState,
  ConfirmDialog,
} from "@/components/shared";
import { StockTable } from "../components/StockTable";
import { AddProductDialog } from "../components/AddProductDialog";
import { useStocks, useCategories } from "../hooks";
import { productService } from "../services/stock.service";
import type { Product } from "../types";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";

export function Stock() {
  usePageTitle("Estoque");

  const { data: stocks, loading, error, refetch } = useStocks();
  const { data: categories } = useCategories();

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  async function handleDeleteProduct() {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete.id);
      toast.success("O produto foi excluído com sucesso.");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível excluir o produto.");
      }
    } finally {
      setProductToDelete(null);
      refetch();
    }
  }

  return (
    <PageContainer title="Estoque">
      {error && <p className="text-red-500 mb-4">{error.message}</p>}

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <StockTable
          stocks={stocks ?? []}
          onDeleteProduct={setProductToDelete}
        />
      )}

      <div className="mt-auto flex justify-end py-12">
        <AddProductDialog
          open={isAddProductDialogOpen}
          onOpenChange={setIsAddProductDialogOpen}
          categories={categories ?? []}
          onSuccess={refetch}
        />
      </div>

      <ConfirmDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Você tem certeza de que deseja excluir o registro abaixo?"
        description={productToDelete?.name ?? ""}
        onConfirm={handleDeleteProduct}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
