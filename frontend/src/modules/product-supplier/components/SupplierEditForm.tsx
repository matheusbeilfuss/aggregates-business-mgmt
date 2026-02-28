import { PageContainer, FormActions } from "@/components/shared";
import { ApiError } from "@/lib/api";
import { Category } from "@/modules/category/types";
import { Product } from "@/modules/product/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  SupplierEditFormData,
  supplierEditSchema,
} from "../schemas/productSupplier.schema";
import {
  supplierService,
  productSupplierService,
} from "../services/productSupplier.service";
import { ProductSupplier } from "../types";
import { SupplierForm } from "./SupplierForm";
import { Form } from "@/components/ui/form";

interface SupplierEditFormProps {
  productSupplier: ProductSupplier;
  products: Product[];
  category: Category | null | undefined;
  catId: number;
  supId: number;
}

export function SupplierEditForm({
  productSupplier,
  products,
  category,
  catId,
  supId,
}: SupplierEditFormProps) {
  const navigate = useNavigate();

  const form = useForm<SupplierEditFormData>({
    resolver: zodResolver(supplierEditSchema),
    defaultValues: {
      supplierName: productSupplier.supplierName,
      productId: productSupplier.productId,
      density: productSupplier.density,
      tonCost: productSupplier.tonCost,
      costPerCubicMeter: productSupplier.costPerCubicMeter,
      costFor5CubicMeters: productSupplier.costFor5CubicMeters ?? 0,
      observations: productSupplier.observations ?? "",
    },
  });

  async function onSubmit(data: SupplierEditFormData) {
    try {
      await Promise.all([
        supplierService.update(productSupplier.supplierId, {
          name: data.supplierName,
        }),
        productSupplierService.update(supId, {
          productId: data.productId,
          density: data.density,
          tonCost: data.tonCost,
          costPerCubicMeter: data.costPerCubicMeter,
          costFor5CubicMeters: data.costFor5CubicMeters,
          observations: data.observations,
        }),
      ]);
      toast.success("Fornecedor atualizado com sucesso.");
      navigate(`/prices/categories/${catId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível atualizar o fornecedor.");
      }
    }
  }

  return (
    <PageContainer title="Editar Fornecedor">
      {category && (
        <h2 className="text-xl font-semibold text-center mb-16">
          {category.name}
        </h2>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SupplierForm
            mode="edit"
            control={form.control}
            products={products}
          />
        </form>
      </Form>
      <FormActions
        cancelPath={`/prices/categories/${catId}`}
        submitLabel="Salvar"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </PageContainer>
  );
}
