import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Package, Tag, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  PageContainer,
  LoadingState,
  FormActions,
  FormSection,
} from "@/components/shared";
import { CategorySelect } from "../components/CategorySelect";
import { useStock } from "../hooks";
import { stockService } from "../services/stock.service";
import {
  editStockSchema,
  type EditStockFormData,
} from "../schemas/stock.schemas";
import { tonToM3, m3ToTon, parseInputNumber } from "../utils/calculations";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCategories } from "@/modules/category/hooks";
import { productService } from "@/modules/product/services/product.service";

export function StockEdit() {
  usePageTitle("Editar produto");

  const navigate = useNavigate();
  const { id: rawStockId } = useParams<{ id: string }>();
  const stockId = Number(rawStockId);
  const validId = Number.isFinite(stockId) && stockId > 0;

  const {
    data: stock,
    loading: stockLoading,
    error: stockError,
  } = useStock(stockId);
  const { data: categories, loading: categoriesLoading } = useCategories({
    enabled: validId,
  });

  const [productId, setProductId] = useState<number | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const [userEditedM3, setUserEditedM3] = useState(false);
  const [userEditedTon, setUserEditedTon] = useState(false);

  const form = useForm<EditStockFormData>({
    resolver: zodResolver(editStockSchema),
    defaultValues: {
      productName: "",
      categoryId: undefined,
      tonQuantity: 0,
      m3Quantity: 0,
      density: 0,
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
        density: stock.density,
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

  if (!validId) return <Navigate to="/stocks" replace />;

  const handleTonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tonQuantity = parseInputNumber(e.target.value);
    setUserEditedTon(true);
    setUserEditedM3(false);
    const density = form.getValues("density");
    if (tonQuantity !== null && density > 0) {
      form.setValue("m3Quantity", tonToM3(tonQuantity, density));
    }
  };

  const handleM3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m3Quantity = parseInputNumber(e.target.value);
    setUserEditedM3(true);
    setUserEditedTon(false);
    const density = form.getValues("density");
    if (m3Quantity !== null && density > 0) {
      form.setValue("tonQuantity", m3ToTon(m3Quantity, density));
    }
  };

  const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const density = parseInputNumber(e.target.value);
    if (density === null || density <= 0) return;

    const currentTon = form.getValues("tonQuantity");
    const currentM3 = form.getValues("m3Quantity");

    if (userEditedM3 && !userEditedTon) {
      form.setValue("tonQuantity", m3ToTon(currentM3, density));
    } else {
      form.setValue("m3Quantity", tonToM3(currentTon, density));
    }
  };

  async function onSubmit(data: EditStockFormData) {
    if (!productId || !stockId) return;
    try {
      await productService.update(productId, {
        name: data.productName,
        categoryId: data.categoryId,
      });
      await stockService.update(stockId, {
        tonQuantity: data.tonQuantity,
        m3Quantity: data.m3Quantity,
        density: data.density,
        productId,
      });
      toast.success("Estoque atualizado com sucesso.");
      navigate("/stocks");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível atualizar o estoque.",
      );
    }
  }

  if (loading || !isFormReady) {
    return (
      <PageContainer title="Editar produto">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Editar produto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-3xl mx-auto space-y-8">
            <FormSection icon={Tag} title="Produto">
              <FormField
                name="productName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onFocus={(e) => e.target.select()}
                      />
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
            </FormSection>

            <FormSection icon={Package} title="Estoque">
              <FormField
                name="density"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Densidade (Ton/m³)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? 0}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDensityChange(e);
                        }}
                      />
                    </FormControl>
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
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? 0}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTonChange(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="m3Quantity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume (m³)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? 0}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          field.onChange(e);
                          handleM3Change(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </FormSection>

            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: "var(--color-error-container)" }}
            >
              <TriangleAlert
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: "var(--color-error)" }}
              />
              <div
                className="space-y-1 text-sm"
                style={{ color: "var(--color-on-error-container)" }}
              >
                <p className="font-semibold">Atenção</p>
                <p>
                  A edição altera diretamente os dados do estoque e{" "}
                  <strong>não gera lançamentos financeiros</strong>. Para
                  registrar uma entrada com custo, use a opção{" "}
                  <em>Adicionar estoque</em>.
                </p>
                <p>
                  Ao alterar a densidade, ela será usada para calcular a
                  conversão de m³ para toneladas nos{" "}
                  <strong>próximos pedidos criados</strong>. Pedidos já
                  existentes não são afetados.
                </p>
              </div>
            </div>
          </div>

          <FormActions
            cancelPath="/stocks"
            submitLabel="Salvar"
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </form>
      </Form>
    </PageContainer>
  );
}
