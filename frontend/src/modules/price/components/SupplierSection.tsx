import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Plus, Truck, UsersRound } from "lucide-react";
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
import { formatLocalCurrency } from "@/utils";
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
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível renomear o fornecedor.",
      );
    } finally {
      setSupplierToRename(null);
    }
  }

  const oneM3Price = prices.find((p) => p.m3Volume === 1)?.price ?? 0;
  const fiveM3Price = prices.find((p) => p.m3Volume === 5)?.price ?? 0;
  const empty = productSuppliers.length === 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
          style={{ backgroundColor: "var(--color-primary-90)" }}
        >
          <Truck
            className="h-3.5 w-3.5"
            style={{ color: "var(--color-primary-40)" }}
          />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Fornecedores</h2>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "var(--color-outline-variant)" }}
        />
        <Button
          className="h-9 px-4 text-sm font-medium text-white gap-1.5
                     hover:opacity-90 active:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--color-primary-40)" }}
          onClick={() =>
            navigate(`/prices/categories/${categoryId}/suppliers/add`)
          }
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {empty ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-12
                     rounded-xl border border-dashed"
          style={{ borderColor: "var(--color-outline-variant)" }}
        >
          <UsersRound
            className="h-6 w-6"
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <p
            className="text-sm"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Nenhum fornecedor cadastrado para essa categoria.
          </p>
        </div>
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
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {[
                  "Fornecedor",
                  "Material",
                  "Densidade",
                  "Custo/Ton",
                  "Custo m³",
                  "Lucro m³",
                  "Custo 5m³",
                  "Lucro 5m³",
                  "",
                ].map((label, i) => (
                  <TableHead
                    key={i}
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: "var(--color-primary-90)",
                      color: "var(--color-primary-40)",
                    }}
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {productSuppliers.map((ps) => {
                const oneM3Profit = oneM3Price - ps.costPerCubicMeter;
                const fiveM3Profit =
                  fiveM3Price - (ps.costFor5CubicMeters ?? 0);
                return (
                  <TableRow
                    key={ps.id}
                    className="hover:bg-accent/50 cursor-default bg-background"
                  >
                    <TableCell>
                      <span className="font-medium flex items-center gap-2 text-sm">
                        {ps.supplierName}
                        {ps.observations && (
                          <Badge
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {ps.observations}
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ps.productName}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">
                      {ps.density.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {formatLocalCurrency(ps.tonCost)}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {formatLocalCurrency(ps.costPerCubicMeter)}
                    </TableCell>
                    <TableCell
                      className="text-sm tabular-nums font-medium"
                      style={{
                        color:
                          oneM3Profit >= 0 ? "#16a34a" : "var(--color-error)",
                      }}
                    >
                      {formatLocalCurrency(oneM3Profit)}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {formatLocalCurrency(ps.costFor5CubicMeters ?? 0)}
                    </TableCell>
                    <TableCell
                      className="text-sm tabular-nums font-medium"
                      style={{
                        color:
                          fiveM3Profit >= 0 ? "#16a34a" : "var(--color-error)",
                      }}
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
        onCancel={() => setSupplierToRename(null)}
      />
    </section>
  );
}
