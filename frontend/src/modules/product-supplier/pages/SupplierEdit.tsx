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

  const navigate = useNavigate();

  const { categoryId: rawCategoryId, supplierId: rawSupplierId } = useParams<{
    categoryId: string;
    supplierId: string;
  }>();
  const categoryId = Number(rawCategoryId);
  const productSupplierId = Number(rawSupplierId);

  const {
    data: productSupplier,
    loading: productSupplierLoading,
    error,
  } = useProductSupplier(productSupplierId);
  const { data: category } = useCategory(categoryId);
  const { data: allProducts, loading: productsLoading } = useProducts();

  const products = (allProducts ?? []).filter(
    (p) => p.category?.id === categoryId,
  );

  useEffect(() => {
    if (error) {
      toast.error("Não foi possível carregar o fornecedor.");
      navigate(`/prices/categories/${categoryId}`);
    }
  }, [error, navigate, categoryId]);

  if (
    !rawCategoryId ||
    !rawSupplierId ||
    Number.isNaN(categoryId) ||
    Number.isNaN(productSupplierId)
  ) {
    navigate("/prices");
    return null;
  }

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
      categoryId={categoryId}
      productSupplierId={productSupplierId}
    />
  );
}
