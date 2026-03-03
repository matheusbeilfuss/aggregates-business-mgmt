import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState, FormActions } from "@/components/shared";
import { Form } from "@/components/ui/form";

import {
  productSupplierAddSchema,
  type ProductSupplierAddFormData,
} from "../schemas/productSupplier.schema";
import { productSupplierService } from "../services/productSupplier.service";
import { supplierService } from "@/modules/supplier/services/supplier.service";
import { useProducts } from "@/modules/product/hooks";
import { ProductSupplierForm } from "../components/ProductSupplierForm";
import { ApiError } from "@/lib/api";
import { useSuppliers } from "@/modules/supplier/hooks";
import { useCategory } from "@/modules/category/hooks";

export function ProductSupplierAdd() {
  usePageTitle("Adicionar Fornecedor");

  const navigate = useNavigate();

  const { categoryId: rawCategoryId } = useParams<{ categoryId: string }>();
  const categoryId = Number(rawCategoryId);
  const validId = Number.isFinite(categoryId) && categoryId > 0;

  const { data: category, loading: categoryLoading } = useCategory(categoryId, {
    enabled: validId,
  });
  const { data: suppliers, loading: suppliersLoading } = useSuppliers();
  const { data: allProducts, loading: productsLoading } = useProducts();

  const products = (allProducts ?? []).filter(
    (p) => p.category?.id === categoryId,
  );

  const form = useForm<ProductSupplierAddFormData>({
    resolver: zodResolver(productSupplierAddSchema),
    defaultValues: {
      supplierId: undefined,
      productId: undefined,
      density: 0,
      tonCost: 0,
      costPerCubicMeter: 0,
      costFor5CubicMeters: 0,
      observations: "",
    },
  });

  if (!rawCategoryId || Number.isNaN(categoryId)) {
    return <Navigate to="/prices" replace />;
  }

  async function onSubmit(data: ProductSupplierAddFormData) {
    try {
      let supplierId = data.supplierId;

      if (!supplierId && data.supplierName) {
        const newSupplier = await supplierService.insert({
          name: data.supplierName.trim(),
        });
        supplierId = newSupplier.id;
        toast.success(
          `Fornecedor "${newSupplier.name}" cadastrado automaticamente.`,
        );
      }

      await productSupplierService.insert({
        productId: data.productId,
        supplierId: supplierId!,
        density: data.density,
        tonCost: data.tonCost,
        costPerCubicMeter: data.costPerCubicMeter,
        costFor5CubicMeters: data.costFor5CubicMeters,
        observations: data.observations,
      });

      toast.success("Fornecedor adicionado com sucesso.");
      navigate(`/prices/categories/${categoryId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível adicionar o fornecedor.");
      }
    }
  }

  const loading = suppliersLoading || productsLoading || categoryLoading;

  if (loading) {
    return (
      <PageContainer title="Adicionar Fornecedor">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Adicionar Fornecedor">
      {category && (
        <h2 className="text-xl font-semibold text-center mb-16">
          {category.name}
        </h2>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProductSupplierForm
            mode="add"
            control={form.control}
            setValue={form.setValue}
            supplierId={form.watch("supplierId")}
            suppliers={suppliers}
            products={products}
          />
        </form>
      </Form>

      <FormActions
        cancelPath={`/prices/categories/${categoryId}`}
        submitLabel="Adicionar"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </PageContainer>
  );
}
