import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageContainer,
  LoadingState,
  ConfirmDialog,
} from "@/components/shared";
import { StockTable } from "../components/StockTable";
import { AddProductDialog } from "../components/AddProductDialog";
import { useStocks } from "../hooks";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCategories } from "@/modules/category/hooks";
import type { Product } from "@/modules/product/types";
import { productService } from "@/modules/product/services/product.service";

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
      toast.success("Produto excluído com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir o produto.",
      );
    } finally {
      setProductToDelete(null);
      refetch();
    }
  }

  return (
    <PageContainer
      title="Estoque"
      actions={
        <Button
          className="h-9 px-4 text-sm font-medium text-white gap-1.5
                     hover:opacity-90 active:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--color-primary-40)" }}
          onClick={() => setIsAddProductDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      }
    >
      {error && (
        <p className="text-sm text-destructive mb-4">{error.message}</p>
      )}

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <StockTable
          stocks={stocks ?? []}
          onDeleteProduct={setProductToDelete}
        />
      )}

      <AddProductDialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
        categories={categories ?? []}
        onSuccess={refetch}
      />

      <ConfirmDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Excluir este produto?"
        description={productToDelete?.name ?? ""}
        onConfirm={handleDeleteProduct}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
