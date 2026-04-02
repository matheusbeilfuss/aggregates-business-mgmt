import { useState } from "react";
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
  const [inputValue, setInputValue] = useState(
    value !== undefined ? String(value).replace(".", ",") : "",
  );

  return (
    <Combobox
      value={value !== undefined ? String(value) : ""}
      onValueChange={(val) => {
        setInputValue(val ?? "");
        onChange(Number(val));
      }}
      disabled={disabled}
    >
      <ComboboxInput
        disabled={disabled}
        className={className}
        value={inputValue}
        onChange={(e) => {
          const raw = e.target.value;
          setInputValue(raw);
          const num = Number(raw.replace(",", "."));
          if (!isNaN(num)) onChange(num);
        }}
        onBlur={() => {
          const num = Number(inputValue.replace(",", "."));
          if (!isNaN(num)) {
            setInputValue(String(num).replace(".", ","));
            onChange(num);
          }
        }}
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
