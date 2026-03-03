import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState } from "@/components/shared";

import { useProductSupplier } from "../hooks/useProductSupplier";
import { useCategory } from "@/modules/category/hooks";
import { useProducts } from "@/modules/product/hooks/useProducts";
import { ProductSupplierEditForm } from "../components/ProductSupplierEditForm";
import { useSuppliers } from "@/modules/supplier/hooks";

export function ProductSupplierEdit() {
  usePageTitle("Editar Fornecedor");

  const navigate = useNavigate();

  const { categoryId: rawCategoryId, productSupplierId: rawProductSupplierId } =
    useParams<{
      categoryId: string;
      productSupplierId: string;
    }>();
  const categoryId = Number(rawCategoryId);
  const productSupplierId = Number(rawProductSupplierId);
  const validIds =
    Number.isFinite(categoryId) &&
    Number.isFinite(productSupplierId) &&
    categoryId > 0 &&
    productSupplierId > 0;

  const {
    data: productSupplier,
    loading: productSupplierLoading,
    error,
  } = useProductSupplier(productSupplierId, { enabled: validIds });
  const { data: category } = useCategory(categoryId, { enabled: validIds });
  const { data: allProducts, loading: productsLoading } = useProducts({
    enabled: validIds,
  });
  const { data: suppliers, loading: suppliersLoading } = useSuppliers({
    enabled: validIds,
  });

  const products = (allProducts ?? []).filter(
    (p) => p.category?.id === categoryId,
  );

  useEffect(() => {
    if (error) {
      toast.error("Não foi possível carregar o fornecedor.");
      navigate(`/prices/categories/${categoryId}`);
    }
  }, [error, navigate, categoryId]);

  if (!validIds) {
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
    <ProductSupplierEditForm
      productSupplier={productSupplier}
      products={products}
      suppliers={suppliers ?? []}
      category={category}
      categoryId={categoryId}
      productSupplierId={productSupplierId}
    />
  );
}
