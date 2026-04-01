import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Price } from "@/modules/price/types";

interface QuantityComboboxProps {
  value?: number;
  prices: Price[];
  disabled?: boolean;
  className?: string;
  onChange: (value: number) => void;
}

export function QuantityCombobox({
  value,
  prices,
  disabled = false,
  className,
  onChange,
}: QuantityComboboxProps) {
  return (
    <Combobox
      value={value !== undefined ? String(value) : ""}
      onValueChange={(val) => onChange(Number(val))}
      disabled={disabled}
    >
      <ComboboxInput
        disabled={disabled}
        className={className}
        value={value !== undefined ? String(value) : ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={
          disabled ? "Selecione um material primeiro" : "Selecione ou digite..."
        }
      />
      <ComboboxContent>
        <ComboboxList>
          {prices.map((price) => (
            <ComboboxItem
              key={price.id}
              value={String(price.m3Volume)}
              className="cursor-pointer"
            >
              {price.m3Volume === 0 ? "Depósito" : `${price.m3Volume} m³`}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
