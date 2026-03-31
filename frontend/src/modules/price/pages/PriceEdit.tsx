import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DollarSign } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  PageContainer,
  LoadingState,
  ConfirmDialog,
  FormSection,
  CurrencyInput,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCategoryPrices } from "../hooks/useCategoryPrices";
import { useCategoryProductSuppliers } from "@/modules/product-supplier/hooks/useCategoryProductSuppliers";
import { useCategory } from "@/modules/category/hooks";
import { priceService } from "../services/price.service";
import { productSupplierService } from "@/modules/product-supplier/services/productSupplier.service";
import { ApiError } from "@/lib/api";
import {
  priceUpdateSchema,
  type PriceUpdateFormData,
} from "../schemas/price.schema";
import { SupplierSection } from "../components/SupplierSection";

const VOLUME_FIELDS = [
  { name: "deposito" as const, label: "Depósito", volume: 0 },
  { name: "m3_1" as const, label: "1 m³", volume: 1 },
  { name: "m3_2" as const, label: "2 m³", volume: 2 },
  { name: "m3_3" as const, label: "3 m³", volume: 3 },
  { name: "m3_4" as const, label: "4 m³", volume: 4 },
  { name: "m3_5" as const, label: "5 m³", volume: 5 },
] satisfies {
  name: keyof PriceUpdateFormData;
  label: string;
  volume: number;
}[];

export function PriceEdit() {
  usePageTitle("Editar Preços");

  const navigate = useNavigate();
  const { categoryId: rawCategoryId } = useParams<{ categoryId: string }>();
  const categoryId = Number(rawCategoryId);
  const validId = Number.isFinite(categoryId) && categoryId > 0;

  const {
    data: prices,
    loading: pricesLoading,
    error: pricesError,
    refetch: refetchPrices,
  } = useCategoryPrices(categoryId, { enabled: validId });
  const {
    data: productSuppliers,
    loading: suppliersLoading,
    error: suppliersError,
    refetch: refetchSuppliers,
  } = useCategoryProductSuppliers(categoryId, { enabled: validId });
  const {
    data: category,
    loading: categoryLoading,
    error: categoryError,
  } = useCategory(categoryId, { enabled: validId });

  const form = useForm<PriceUpdateFormData>({
    resolver: zodResolver(priceUpdateSchema),
    defaultValues: { deposito: 0, m3_1: 0, m3_2: 0, m3_3: 0, m3_4: 0, m3_5: 0 },
  });

  const error = pricesError || suppliersError || categoryError;

  useEffect(() => {
    if (error) {
      toast.error("Não foi possível carregar os dados.");
      navigate("/prices");
    }
  }, [error, navigate]);

  useEffect(() => {
    if ((prices ?? []).length === 0) return;
    const byVolume = Object.fromEntries(
      (prices ?? []).map((p) => [p.m3Volume, p.price]),
    );
    form.reset({
      deposito: byVolume[0] ?? 0,
      m3_1: byVolume[1] ?? 0,
      m3_2: byVolume[2] ?? 0,
      m3_3: byVolume[3] ?? 0,
      m3_4: byVolume[4] ?? 0,
      m3_5: byVolume[5] ?? 0,
    });
  }, [prices, form]);

  async function onSubmitPrices(data: PriceUpdateFormData) {
    const updated = (prices ?? []).map((p) => {
      const field = VOLUME_FIELDS.find((f) => f.volume === p.m3Volume);
      return { ...p, price: field ? data[field.name] : p.price };
    });
    try {
      await priceService.updateByCategory(categoryId, updated);
      await refetchPrices();
      toast.success("Preços atualizados com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível salvar os preços.",
      );
    }
  }

  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

  async function handleDeleteSupplier() {
    if (supplierToDelete === null) return;
    try {
      await productSupplierService.delete(supplierToDelete);
      await refetchSuppliers();
      toast.success("Fornecedor removido com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Erro ao remover fornecedor.",
      );
    } finally {
      setSupplierToDelete(null);
    }
  }

  if (!validId) return <Navigate to="/prices" replace />;

  const loading = pricesLoading || suppliersLoading || categoryLoading;

  return (
    <PageContainer title="Editar preços" subtitle={category?.name}>
      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          <FormSection icon={DollarSign} title="Valores">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitPrices)}
                className="md:col-span-2 space-y-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {VOLUME_FIELDS.map((f) => (
                    <FormField
                      key={f.name}
                      control={form.control}
                      name={f.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-xs font-medium"
                            style={{ color: "var(--color-on-surface-variant)" }}
                          >
                            {f.label}
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="h-9 px-4 text-sm cursor-pointer"
                    onClick={() => navigate("/prices")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="h-9 px-4 text-sm font-medium text-white cursor-pointer
                               hover:opacity-90 active:opacity-80 transition-opacity"
                    style={{ backgroundColor: "var(--color-primary-40)" }}
                  >
                    Salvar preços
                  </Button>
                </div>
              </form>
            </Form>
          </FormSection>

          <SupplierSection
            categoryId={categoryId}
            productSuppliers={productSuppliers ?? []}
            prices={prices ?? []}
            onDeleteSupplier={setSupplierToDelete}
            onRefetch={refetchSuppliers}
          />
        </div>
      )}

      <ConfirmDialog
        open={supplierToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setSupplierToDelete(null);
        }}
        title="Excluir este fornecedor?"
        description={(() => {
          const ps = (productSuppliers ?? []).find(
            (ps) => ps.id === supplierToDelete,
          );
          return ps ? `${ps.supplierName} — ${ps.productName}` : "";
        })()}
        onConfirm={handleDeleteSupplier}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
