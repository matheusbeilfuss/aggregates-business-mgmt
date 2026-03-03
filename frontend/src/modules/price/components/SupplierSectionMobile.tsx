import { ProductSupplier } from "@/modules/product-supplier/types";
import { Price } from "../types";
import { SupplierCard } from "./SupplierCard";

interface SupplierSectionMobileProps {
  productSuppliers: ProductSupplier[];
  prices: Price[];
  categoryId: number;
  onRename: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function SupplierSectionMobile({
  productSuppliers,
  prices,
  categoryId,
  onRename,
  onDelete,
}: SupplierSectionMobileProps) {
  const oneM3Price = prices.find((p) => p.m3Volume === 1)?.price ?? 0;
  const fiveM3Price = prices.find((p) => p.m3Volume === 5)?.price ?? 0;

  return (
    <div className="md:hidden space-y-3 mb-10">
      {productSuppliers.map((ps) => (
        <SupplierCard
          key={ps.id}
          ps={ps}
          categoryId={categoryId}
          oneM3Price={oneM3Price}
          fiveM3Price={fiveM3Price}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
