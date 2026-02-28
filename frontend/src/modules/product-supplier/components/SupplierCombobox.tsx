import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Supplier } from "../types";
import { useMemo } from "react";

interface SupplierComboboxProps {
  value: string;
  supplierId?: number;
  suppliers: Supplier[];
  className?: string;
  onChange: (value: string) => void;
  onSupplierSelect: (supplier: Supplier) => void;
}

export function SupplierCombobox({
  value,
  supplierId,
  suppliers,
  className,
  onChange,
  onSupplierSelect,
}: SupplierComboboxProps) {
  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter((s) =>
        s.name.toLowerCase().includes(value.toLowerCase()),
      ),
    [suppliers, value],
  );

  return (
    <Combobox
      value={supplierId ? String(supplierId) : ""}
      onValueChange={(val) => {
        const supplier = suppliers.find((s) => String(s.id) === val);
        if (supplier) onSupplierSelect(supplier);
      }}
    >
      <ComboboxInput
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busque ou digite o nome do fornecedor"
      />
      <ComboboxContent>
        {filteredSuppliers.length === 0 && (
          <ComboboxEmpty>Novo fornecedor</ComboboxEmpty>
        )}
        <ComboboxList>
          {filteredSuppliers.map((s) => (
            <ComboboxItem key={s.id} value={String(s.id)}>
              {s.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
