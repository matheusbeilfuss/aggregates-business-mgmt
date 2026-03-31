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
  const { data: suppliers, loading: suppliersLoading } = useSuppliers({
    enabled: validId,
  });
  const { data: allProducts, loading: productsLoading } = useProducts({
    enabled: validId,
  });

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

  if (!validId) return <Navigate to="/prices" replace />;

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
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível adicionar o fornecedor.",
      );
    }
  }

  const loading = suppliersLoading || productsLoading || categoryLoading;

  if (loading) {
    return (
      <PageContainer title="Adicionar fornecedor">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Adicionar fornecedor" subtitle={category?.name}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-3xl mx-auto">
            <ProductSupplierForm
              mode="add"
              control={form.control}
              setValue={form.setValue}
              supplierId={form.watch("supplierId")}
              suppliers={suppliers ?? []}
              products={products}
            />
          </div>
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
