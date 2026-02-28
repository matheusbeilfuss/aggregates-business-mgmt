import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState } from "@/components/shared";

import { useProductSupplier } from "../hooks/useProductSupplier";
import { useCategory } from "@/modules/category/hooks/useCategory";
import { useProducts } from "@/modules/product/hooks/useProducts";
import { SupplierEditForm } from "../components/SupplierEditForm";

export function SupplierEdit() {
  usePageTitle("Editar Fornecedor");

  const { categoryId, supplierId } = useParams<{
    categoryId: string;
    supplierId: string;
  }>();
  const catId = Number(categoryId);
  const supId = Number(supplierId);
  const navigate = useNavigate();

  const {
    data: productSupplier,
    loading: productSupplierLoading,
    error,
  } = useProductSupplier(supId);
  const { data: category } = useCategory(catId);
  const { data: allProducts, loading: productsLoading } = useProducts();

  const products = (allProducts ?? []).filter((p) => p.category?.id === catId);

  console.log("catId:", catId);
  console.log("allProducts:", allProducts);
  console.log("products filtrados:", products);
  console.log("productSupplier.productId:", productSupplier?.productId);

  useEffect(() => {
    if (error) {
      toast.error("Não foi possível carregar o fornecedor.");
      navigate(`/prices/categories/${catId}`);
    }
  }, [error, navigate, catId]);

  if (productSupplierLoading || productsLoading || !productSupplier) {
    return (
      <PageContainer title="Editar Fornecedor">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <SupplierEditForm
      productSupplier={productSupplier}
      products={products}
      category={category}
      catId={catId}
      supId={supId}
    />
  );
}
