import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState, FormActions } from "@/components/shared";
import { Form } from "@/components/ui/form";

import {
  supplierAddSchema,
  type SupplierAddFormData,
} from "../schemas/productSupplier.schema";
import {
  productSupplierService,
  supplierService,
} from "../services/productSupplier.service";
import { useProducts } from "@/modules/product/hooks";
import { SupplierForm } from "../components/SupplierForm";
import { ApiError } from "@/lib/api";
import { useSuppliers } from "../hooks/useSuppliers";
import { useCategory } from "@/modules/category/hooks/useCategory";

export function SupplierAdd() {
  usePageTitle("Adicionar Fornecedor");

  const { categoryId } = useParams<{ categoryId: string }>();
  const id = Number(categoryId);

  const { data: category, loading: categoryLoading } = useCategory(id);

  const navigate = useNavigate();

  const { data: suppliers, loading: suppliersLoading } = useSuppliers();
  const { data: allProducts, loading: productsLoading } = useProducts();

  const products = (allProducts ?? []).filter((p) => p.category?.id === id);

  const form = useForm<SupplierAddFormData>({
    resolver: zodResolver(supplierAddSchema),
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

  async function onSubmit(data: SupplierAddFormData) {
    try {
      let supplierId = data.supplierId;

      if (!supplierId && data.supplierName) {
        const newSupplier = await supplierService.insert({
          name: data.supplierName,
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
      navigate(`/prices/categories/${id}`);
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
          <SupplierForm
            mode="add"
            control={form.control}
            setValue={form.setValue}
            suppliers={suppliers}
            products={products}
          />
        </form>
      </Form>

      <FormActions
        cancelPath={`/prices/categories/${id}`}
        submitLabel="Adicionar"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </PageContainer>
  );
}
