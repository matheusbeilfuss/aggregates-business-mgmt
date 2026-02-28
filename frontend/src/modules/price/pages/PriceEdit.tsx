import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Pencil, X, MoreHorizontal } from "lucide-react";

import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer } from "@/components/shared";
import { LoadingState } from "@/components/shared";
import { ConfirmDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { priceService } from "../services/price.service";
import { productSupplierService } from "@/modules/product-supplier/services/productSupplier.service";
import { Price } from "../types";
import { formatCurrency, parseCurrency } from "@/utils/money";
import { ApiError } from "@/lib/api";
import { useCategory } from "@/modules/category/hooks/useCategory";

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

  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [savingPrices, setSavingPrices] = useState(false);

  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

  function getPriceValue(price: Price): string {
    if (priceInputs[price.id] !== undefined) return priceInputs[price.id];
    return price.price.toFixed(2).replace(".", ",");
  }

  function handlePriceChange(priceId: number, value: string) {
    const cleaned = value.replace(/[^0-9.,]/g, "");
    setPriceInputs((prev) => ({ ...prev, [priceId]: cleaned }));
  }

  async function handleSavePrices() {
    setSavingPrices(true);
    try {
      const updated: Price[] = prices.map((p) => {
        const inputValue = priceInputs[p.id];
        return {
          ...p,
          price:
            inputValue !== undefined
              ? (parseCurrency(inputValue) ?? p.price)
              : p.price,
        };
      });
      await priceService.updateByCategory(id, updated);
      await refetchPrices();
      setPriceInputs({});
      toast.success("Preços atualizados com sucesso.");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível salvar os preços.");
      }
    } finally {
      setSavingPrices(false);
    }
  }

  function handleCancelPrices() {
    setPriceInputs({});
  }

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

  const categoryName = category?.name;

  const volumes = [...new Set(prices.map((p) => p.m3Volume))].sort(
    (a, b) => a - b,
  );

  const loading = pricesLoading || suppliersLoading || categoryLoading;
  const error = pricesError || suppliersError || categoryError;

  return (
    <PageContainer title="Editar preços">
      {error && <p className="text-red-500 mb-4">{error.message}</p>}

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <div className="space-y-10">
          <h2 className="text-xl font-semibold text-center">{categoryName}</h2>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Valores</h3>

            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr>
                    {volumes.map((v) => (
                      <th
                        key={v}
                        className="px-3 pb-2 text-center font-medium text-muted-foreground"
                      >
                        {v === 0 ? "Depósito" : `${v} m³`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {volumes.map((v, idx) => {
                      const price = prices.find((p) => p.m3Volume === v);
                      return (
                        <td key={v} className="px-3 pb-2">
                          <div className="flex items-center gap-1">
                            {idx === 0 && (
                              <span className="text-muted-foreground text-sm">
                                R$
                              </span>
                            )}
                            <Input
                              className="text-right"
                              value={price ? getPriceValue(price) : ""}
                              onChange={(e) =>
                                price &&
                                handlePriceChange(price.id, e.target.value)
                              }
                              disabled={!price}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancelPrices}
                disabled={savingPrices}
              >
                Cancelar
              </Button>
              <Button onClick={handleSavePrices} disabled={savingPrices}>
                {savingPrices ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </section>

          <hr />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Fornecedores</h3>
              <Button
                onClick={() =>
                  navigate(`/prices/categories/${id}/suppliers/add`)
                }
              >
                Adicionar Fornecedor
              </Button>
            </div>

            <Table>
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
                      colSpan={8}
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
                        <TableCell>{ps.supplierName}</TableCell>
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
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
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
                                className="text-red-500 focus:text-red-500"
                                onClick={() => setSupplierToDelete(ps.id)}
                              >
                                <X className="mr-2 h-4 w-4" />
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
