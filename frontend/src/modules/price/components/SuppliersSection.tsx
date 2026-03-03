import { useNavigate } from "react-router-dom";
import { Pencil, X, MoreHorizontal, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/utils/money";
import { ProductSupplier } from "@/modules/product-supplier/types";
import { Price } from "../types";
import { ApiError } from "@/lib/api";
import { supplierService } from "@/modules/product-supplier/services/productSupplier.service";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { RenameSupplierDialog } from "@/modules/product-supplier/components/RenameSupplierDialog";

interface SuppliersSectionProps {
  categoryId: number;
  productSuppliers: ProductSupplier[];
  prices: Price[];
  onDeleteSupplier: (id: number) => void;
  onRefetch: () => void;
}

export function SuppliersSection({
  categoryId,
  productSuppliers,
  prices,
  onDeleteSupplier,
  onRefetch,
}: SuppliersSectionProps) {
  const navigate = useNavigate();

  const [supplierToRename, setSupplierToRename] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [newSupplierName, setNewSupplierName] = useState("");
  const lastSupplierName = useRef<string>("");

  function openRenameDialog(id: number, name: string) {
    lastSupplierName.current = name;
    setSupplierToRename({ id, name });
    setNewSupplierName(name);
  }

  async function handleRenameSupplier() {
    if (!supplierToRename || !newSupplierName.trim()) return;
    try {
      await supplierService.update(supplierToRename.id, {
        name: newSupplierName.trim(),
      });
      toast.success("Fornecedor renomeado com sucesso.");
      onRefetch();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível renomear o fornecedor.");
      }
    } finally {
      setSupplierToRename(null);
      setNewSupplierName("");
    }
  }

  const oneM3Price = prices.find((p) => p.m3Volume === 1)?.price ?? 0;
  const fiveM3Price = prices.find((p) => p.m3Volume === 5)?.price ?? 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Fornecedores</h3>
        <Button
          className="bg-slate-500 hover:bg-slate-600 text-white"
          onClick={() =>
            navigate(`/prices/categories/${categoryId}/suppliers/add`)
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
              const oneM3Profit = oneM3Price - ps.costPerCubicMeter;
              const fiveM3Profit = fiveM3Price - (ps.costFor5CubicMeters ?? 0);

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
                  <TableCell>{ps.density.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{formatCurrency(ps.tonCost)}</TableCell>
                  <TableCell>{formatCurrency(ps.costPerCubicMeter)}</TableCell>
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
                      <DropdownMenuTrigger asChild className="cursor-pointer">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            openRenameDialog(ps.supplierId, ps.supplierName)
                          }
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          Renomear
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/prices/categories/${categoryId}/suppliers/${ps.id}/edit`,
                            )
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500 cursor-pointer"
                          onClick={() => onDeleteSupplier(ps.id)}
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

      <RenameSupplierDialog
        open={!!supplierToRename}
        currentName={lastSupplierName.current}
        newName={newSupplierName}
        onNewNameChange={setNewSupplierName}
        onConfirm={handleRenameSupplier}
        onCancel={() => {
          setSupplierToRename(null);
          setNewSupplierName("");
        }}
      />
    </section>
  );
}
