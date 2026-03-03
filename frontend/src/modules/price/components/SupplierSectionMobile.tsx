import { ProductSupplier } from "@/modules/product-supplier/types";
import { SupplierCard } from "./SupplierCard";

interface SupplierSectionMobileProps {
  productSuppliers: ProductSupplier[];
  categoryId: number;
  oneM3Price: number;
  fiveM3Price: number;
  onRename: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function SupplierSectionMobile({
  productSuppliers,
  categoryId,
  oneM3Price,
  fiveM3Price,
  onRename,
  onDelete,
}: SupplierSectionMobileProps) {
  return (
    <div className="space-y-3 mb-10">
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
