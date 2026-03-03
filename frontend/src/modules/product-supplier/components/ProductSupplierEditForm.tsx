import { PageContainer, FormActions } from "@/components/shared";
import { ApiError } from "@/lib/api";
import { Category } from "@/modules/category/types";
import { Product } from "@/modules/product/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ProductSupplierEditFormData,
  productSupplierEditSchema,
} from "../schemas/productSupplier.schema";
import { productSupplierService } from "../services/productSupplier.service";
import { ProductSupplier } from "../types";
import { Supplier } from "@/modules/supplier/types";
import { ProductSupplierForm } from "./ProductSupplierForm";
import { Form } from "@/components/ui/form";

interface ProductSupplierEditFormProps {
  productSupplier: ProductSupplier;
  products: Product[];
  suppliers: Supplier[];
  category: Category | null | undefined;
  categoryId: number;
  productSupplierId: number;
}

export function ProductSupplierEditForm({
  productSupplier,
  products,
  suppliers,
  category,
  categoryId,
  productSupplierId,
}: ProductSupplierEditFormProps) {
  const navigate = useNavigate();

  const form = useForm<ProductSupplierEditFormData>({
    resolver: zodResolver(productSupplierEditSchema),
    defaultValues: {
      supplierId: productSupplier.supplierId,
      productId: productSupplier.productId,
      density: productSupplier.density,
      tonCost: productSupplier.tonCost,
      costPerCubicMeter: productSupplier.costPerCubicMeter,
      costFor5CubicMeters: productSupplier.costFor5CubicMeters,
      observations: productSupplier.observations ?? "",
    },
  });

  async function onSubmit(data: ProductSupplierEditFormData) {
    try {
      await productSupplierService.update(productSupplierId, {
        supplierId: data.supplierId,
        productId: data.productId,
        density: data.density,
        tonCost: data.tonCost,
        costPerCubicMeter: data.costPerCubicMeter,
        costFor5CubicMeters: data.costFor5CubicMeters,
        observations: data.observations,
      });
      toast.success("Fornecedor atualizado com sucesso.");
      navigate(`/prices/categories/${categoryId}`);
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
          <ProductSupplierForm
            mode="edit"
            control={form.control}
            products={products}
            suppliers={suppliers}
          />
        </form>
      </Form>
      <FormActions
        cancelPath={`/prices/categories/${categoryId}`}
        submitLabel="Salvar"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </PageContainer>
  );
}
