import { formatCurrency, parseCurrency } from "@/utils/money";
import { useState } from "react";
import { Input } from "../ui/input";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

export function MoneyInput({
  value,
  onChange,
  placeholder = "R$ 0,00",
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value ? formatCurrency(value) : "",
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value;

    setDisplayValue(rawValue);

    const parsedValue = parseCurrency(rawValue);

    if (!Number.isNaN(parsedValue)) {
      onChange(parsedValue);
    } else {
      onChange(0);
    }
  }

  function handleBlur() {
    setDisplayValue(value ? formatCurrency(value) : "");
  }

  return (
    <Input
      inputMode="decimal"
      value={displayValue}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
