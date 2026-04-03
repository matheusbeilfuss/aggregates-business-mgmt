import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { formatLocalCurrency, parseLocalCurrency } from "@/utils";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  "aria-invalid"?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  disabled,
  className,
  placeholder = "R$ 0,00",
  "aria-invalid": ariaInvalid,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    value != null ? formatLocalCurrency(value) : "",
  );
  const isFocused = useRef(false);

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    isFocused.current = true;
    if (value != null) {
      const raw = value.toFixed(2).replace(".", ",");
      setDisplayValue(raw);
    } else {
      setDisplayValue("");
    }
    const target = e.target;
    setTimeout(() => target.select(), 0);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setDisplayValue(raw);
    const parsed = parseLocalCurrency(raw);
    onChange(parsed);
  }

  function handleBlur() {
    isFocused.current = false;
    const parsed = parseLocalCurrency(displayValue);
    if (parsed != null) {
      setDisplayValue(formatLocalCurrency(parsed));
      onChange(parsed);
    } else {
      setDisplayValue("");
      onChange(undefined);
    }
  }

  useEffect(() => {
    if (!isFocused.current) {
      const external = value != null ? formatLocalCurrency(value) : "";
      setDisplayValue(external);
    }
  }, [value]);

  return (
    <Input
      inputMode="decimal"
      value={displayValue}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(className)}
      aria-invalid={ariaInvalid}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
