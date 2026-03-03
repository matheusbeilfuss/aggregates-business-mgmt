import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState } from "@/components/shared";

import { useProductSupplier } from "../hooks/useProductSupplier";
import { useCategory } from "@/modules/category/hooks/useCategory";
import { useProducts } from "@/modules/product/hooks/useProducts";
import { SupplierEditForm } from "../components/SupplierEditForm";
import { useSuppliers } from "../hooks/useSuppliers";

export function SupplierEdit() {
  usePageTitle("Editar Fornecedor");

  const navigate = useNavigate();

  const { categoryId: rawCategoryId, productSupplierId: rawProductSupplierId } =
    useParams<{
      categoryId: string;
      productSupplierId: string;
    }>();
  const categoryId = Number(rawCategoryId);
  const productSupplierId = Number(rawProductSupplierId);

  const {
    data: productSupplier,
    loading: productSupplierLoading,
    error,
  } = useProductSupplier(productSupplierId);
  const { data: category } = useCategory(categoryId);
  const { data: allProducts, loading: productsLoading } = useProducts();
  const { data: suppliers, loading: suppliersLoading } = useSuppliers();

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
    !rawProductSupplierId ||
    Number.isNaN(categoryId) ||
    Number.isNaN(productSupplierId)
  ) {
    return <Navigate to="/prices" replace />;
  }

  if (
    productSupplierLoading ||
    productsLoading ||
    suppliersLoading ||
    !productSupplier
  ) {
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
      suppliers={suppliers ?? []}
      category={category}
      categoryId={categoryId}
      productSupplierId={productSupplierId}
    />
  );
}
