import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatLocalCurrency } from "@/utils/";
import { ProductSupplier } from "@/modules/product-supplier/types";
import { Price } from "../types";
import { ApiError } from "@/lib/api";
import { supplierService } from "@/modules/supplier/services/supplier.service";
import { RenameSupplierDialog } from "@/modules/product-supplier/components/RenameSupplierDialog";
import { SupplierActions } from "./SupplierActions";
import { SupplierSectionMobile } from "./SupplierSectionMobile";
import { useIsMobile } from "@/hooks/useMobile";

interface ProductSuppliersSectionProps {
  categoryId: number;
  productSuppliers: ProductSupplier[];
  prices: Price[];
  onDeleteSupplier: (id: number) => void;
  onRefetch: () => void;
}

export function SupplierSection({
  categoryId,
  productSuppliers,
  prices,
  onDeleteSupplier,
  onRefetch,
}: ProductSuppliersSectionProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
  const empty = productSuppliers.length === 0;

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

      {empty ? (
        <p className="text-center text-muted-foreground py-8">
          Nenhum fornecedor cadastrado para essa categoria.
        </p>
      ) : isMobile ? (
        <SupplierSectionMobile
          productSuppliers={productSuppliers}
          categoryId={categoryId}
          oneM3Price={oneM3Price}
          fiveM3Price={fiveM3Price}
          onRename={openRenameDialog}
          onDelete={onDeleteSupplier}
        />
      ) : (
        <div className="mb-10">
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
              {productSuppliers.map((ps) => {
                const oneM3Profit = oneM3Price - ps.costPerCubicMeter;
                const fiveM3Profit =
                  fiveM3Price - (ps.costFor5CubicMeters ?? 0);
                return (
                  <TableRow key={ps.id}>
                    <TableCell>
                      <span className="font-medium flex items-center gap-2">
                        {ps.supplierName}
                        {ps.observations && (
                          <Badge variant="secondary" className="font-normal">
                            {ps.observations}
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>{ps.productName}</TableCell>
                    <TableCell>{ps.density.toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{formatLocalCurrency(ps.tonCost)}</TableCell>
                    <TableCell>
                      {formatLocalCurrency(ps.costPerCubicMeter)}
                    </TableCell>
                    <TableCell
                      className={
                        oneM3Profit >= 0 ? "text-green-600" : "text-red-500"
                      }
                    >
                      {formatLocalCurrency(oneM3Profit)}
                    </TableCell>
                    <TableCell>
                      {formatLocalCurrency(ps.costFor5CubicMeters ?? 0)}
                    </TableCell>
                    <TableCell
                      className={
                        fiveM3Profit >= 0 ? "text-green-600" : "text-red-500"
                      }
                    >
                      {formatLocalCurrency(fiveM3Profit)}
                    </TableCell>
                    <TableCell>
                      <SupplierActions
                        ps={ps}
                        categoryId={categoryId}
                        onRename={openRenameDialog}
                        onDelete={onDeleteSupplier}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

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
