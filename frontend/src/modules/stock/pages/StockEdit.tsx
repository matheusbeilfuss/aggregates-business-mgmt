import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { PageContainer, LoadingState, FormActions } from "@/components/shared";
import { CategorySelect } from "../components/CategorySelect";
import { useStock, useCategories } from "../hooks";
import { stockService, productService } from "../services/stock.service";
import {
  editStockSchema,
  type EditStockFormData,
} from "../schemas/stock.schemas";

export function StockEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: stock,
    loading: stockLoading,
    error: stockError,
  } = useStock(id!);
  const { data: categories, loading: categoriesLoading } = useCategories();

  const [productId, setProductId] = useState<number | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);

  const form = useForm<EditStockFormData>({
    resolver: zodResolver(editStockSchema),
    defaultValues: {
      productName: "",
      categoryId: undefined,
      tonQuantity: 0,
      m3Quantity: 0,
    } as DefaultValues<EditStockFormData>,
  });

  const loading = stockLoading || categoriesLoading;

  useEffect(() => {
    if (stock && !isFormReady) {
      form.reset({
        productName: stock.product.name,
        categoryId: stock.product.category.id,
        tonQuantity: stock.tonQuantity,
        m3Quantity: stock.m3Quantity,
      });
      setProductId(stock.product.id);
      setIsFormReady(true);
    }
  }, [stock, form, isFormReady]);

  useEffect(() => {
    if (stockError) {
      toast.error("Não foi possível carregar o estoque.");
      navigate("/stocks");
    }
  }, [stockError, navigate]);

  async function onSubmit(data: EditStockFormData) {
    if (!productId || !id) return;

    try {
      await productService.update(productId, {
        name: data.productName,
        categoryId: data.categoryId,
      });

      await stockService.update(id, {
        tonQuantity: data.tonQuantity,
        m3Quantity: data.m3Quantity,
        productId,
      });

      toast.success("Estoque atualizado com sucesso!");
      navigate("/stocks");
    } catch {
      toast.error("Não foi possível atualizar o estoque.");
    }
  }

  if (loading || !isFormReady) {
    return (
      <PageContainer title="Editar estoque">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Editar estoque">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <FormField
            name="productName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <CategorySelect
                  value={field.value}
                  onChange={field.onChange}
                  categories={categories ?? []}
                />
              </FormItem>
            )}
          />

          <FormField
            name="tonQuantity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Toneladas</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? 0} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="m3Quantity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>M³</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? 0} />
                </FormControl>
              </FormItem>
            )}
          />

          <Alert variant="destructive" className="md:col-span-2">
            <TriangleAlert />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Ao realizar esta edição, lembre-se de checar as últimas saídas
            </AlertDescription>
          </Alert>
        </form>
      </Form>

      <FormActions
        cancelPath="/stocks"
        submitLabel="Salvar"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </PageContainer>
  );
}
