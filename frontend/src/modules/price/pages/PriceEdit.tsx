import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, X, MoreHorizontal } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCategoryPrices } from "../hooks/useCategoryPrices";
import { useCategoryProductSuppliers } from "@/modules/product-supplier/hooks/useCategoryProductSuppliers";
import { useCategory } from "@/modules/category/hooks/useCategory";
import { priceService } from "../services/price.service";
import { productSupplierService } from "@/modules/product-supplier/services/productSupplier.service";
import { formatCurrency } from "@/utils/money";
import { ApiError } from "@/lib/api";
import {
  priceUpdateSchema,
  type PriceUpdateFormData,
} from "../schemas/price.schema";
import { Separator } from "@/components/ui/separator";

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

  const { categoryId } = useParams<{ categoryId: string }>();
  const id = Number(categoryId);
  const navigate = useNavigate();

  const {
    data: prices,
    loading: pricesLoading,
    error: pricesError,
    refetch: refetchPrices,
  } = useCategoryPrices(id);

  const {
    data: productSuppliers,
    loading: suppliersLoading,
    error: suppliersError,
    refetch: refetchSuppliers,
  } = useCategoryProductSuppliers(id);

  const {
    data: category,
    loading: categoryLoading,
    error: categoryError,
  } = useCategory(id);

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
    if (prices.length === 0) return;

    const byVolume = Object.fromEntries(
      prices.map((p) => [p.m3Volume, p.price]),
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
    const updated = prices.map((p) => {
      const field = VOLUME_FIELDS.find((f) => f.volume === p.m3Volume);
      return {
        ...p,
        price: field ? data[field.name] : p.price,
      };
    });

    try {
      await priceService.updateByCategory(id, updated);
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
                    onClick={() => form.handleSubmit(onSubmitPrices)}
                    className="bg-slate-500 hover:bg-slate-600 text-white"
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </Form>
          </section>

          <Separator />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Fornecedores</h3>
              <Button
                className="bg-slate-500 hover:bg-slate-600 text-white"
                onClick={() =>
                  navigate(`/prices/categories/${id}/suppliers/add`)
                }
              >
                Adicionar Fornecedor
              </Button>
            </div>

            <Table className="mb-10">
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Densidade</TableHead>
                  <TableHead>Custo Tonelada</TableHead>
                  <TableHead>
                    Custo m<sup>3</sup>
                  </TableHead>
                  <TableHead>
                    Lucro m<sup>3</sup>
                  </TableHead>
                  <TableHead>
                    Custo 5m<sup>3</sup>
                  </TableHead>
                  <TableHead>
                    Lucro 5m<sup>3</sup>
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {productSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-8"
                    >
                      Nenhum fornecedor cadastrado para essa categoria.
                    </TableCell>
                  </TableRow>
                ) : (
                  productSuppliers.map((ps) => {
                    const oneM3Price =
                      prices.find((p) => p.m3Volume === 1)?.price ?? 0;
                    const oneM3Profit = oneM3Price - ps.costPerCubicMeter;

                    const fiveM3Price =
                      prices.find((p) => p.m3Volume === 5)?.price ?? 0;
                    const fiveM3Profit =
                      fiveM3Price - (ps.costFor5CubicMeters ?? 0);

                    return (
                      <TableRow key={ps.id}>
                        <TableCell>
                          <span className="font-medium flex items-center gap-2">
                            {ps.supplierName}
                            {ps.observations && (
                              <span className="text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground">
                                {ps.observations}
                              </span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>{ps.productName}</TableCell>
                        <TableCell>
                          {ps.density.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>{formatCurrency(ps.tonCost)}</TableCell>
                        <TableCell>
                          {formatCurrency(ps.costPerCubicMeter)}
                        </TableCell>
                        <TableCell
                          className={
                            oneM3Profit >= 0 ? "text-green-600" : "text-red-500"
                          }
                        >
                          {formatCurrency(oneM3Profit)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(ps.costFor5CubicMeters ?? 0)}
                        </TableCell>
                        <TableCell
                          className={
                            ps.costFor5CubicMeters
                              ? fiveM3Profit >= 0
                                ? "text-green-600"
                                : "text-red-500"
                              : ""
                          }
                        >
                          {ps.costFor5CubicMeters
                            ? formatCurrency(fiveM3Profit)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              className="cursor-pointer"
                            >
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  navigate(
                                    `/prices/categories/${id}/suppliers/${ps.id}/edit`,
                                  )
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-500 cursor-pointer"
                                onClick={() => setSupplierToDelete(ps.id)}
                              >
                                <X className="mr-2 h-4 w-4 text-red-500" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </section>
        </div>
      )}

      <ConfirmDialog
        open={supplierToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setSupplierToDelete(null);
        }}
        title="Você tem certeza que deseja excluir este fornecedor?"
        description={
          productSuppliers.find((ps) => ps.id === supplierToDelete)
            ?.supplierName ?? ""
        }
        onConfirm={handleDeleteSupplier}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
