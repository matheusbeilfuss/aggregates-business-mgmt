import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  PageContainer,
  LoadingState,
  ConfirmDialog,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
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
    defaultValues: {
      deposito: 0,
      m3_1: 0,
      m3_2: 0,
      m3_3: 0,
      m3_4: 0,
      m3_5: 0,
    },
  });

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
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível salvar os preços.");
      }
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
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao remover fornecedor.");
      }
    } finally {
      setSupplierToDelete(null);
    }
  }

  if (!validId) {
    return <Navigate to="/prices" replace />;
  }

  const loading = pricesLoading || suppliersLoading || categoryLoading;
  const error = pricesError || suppliersError || categoryError;

  return (
    <PageContainer title="Editar preços">
      {error && <p className="text-red-500 mb-4">{error.message}</p>}

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <div className="space-y-10">
          <h2 className="text-xl font-semibold text-center">
            {category?.name}
          </h2>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Valores</h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitPrices)}
                className="space-y-4"
              >
                <div className="overflow-x-auto">
                  <table className="text-sm">
                    <thead>
                      <tr>
                        {VOLUME_FIELDS.map((f) => (
                          <th
                            key={f.name}
                            className="px-3 pb-2 text-center font-medium text-muted-foreground"
                          >
                            {f.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {VOLUME_FIELDS.map((f, idx) => (
                          <td key={f.name} className="px-3 pb-2 align-top">
                            <FormField
                              control={form.control}
                              name={f.name}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="flex items-center gap-1">
                                      {idx === 0 && (
                                        <span className="text-muted-foreground text-sm">
                                          R$
                                        </span>
                                      )}
                                      <Input
                                        className="text-right"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => navigate("/prices")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-slate-500 hover:bg-slate-600 text-white"
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </Form>
          </section>

          <Separator />

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
        title="Você tem certeza que deseja excluir este fornecedor?"
        description={(() => {
          const ps = (productSuppliers ?? []).find(
            (ps) => ps.id === supplierToDelete,
          );
          return ps ? `${ps.supplierName} - ${ps.productName}` : "";
        })()}
        onConfirm={handleDeleteSupplier}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
