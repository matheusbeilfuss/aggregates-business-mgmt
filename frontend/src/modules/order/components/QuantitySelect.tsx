import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Price } from "../types";

interface QuantitySelectProps {
  value?: number;
  prices: Price[];
  disabled?: boolean;
  className?: string;
  onChange: (value: number) => void;
}

export function QuantitySelect({
  value,
  prices,
  disabled = false,
  className,
  onChange,
}: QuantitySelectProps) {
  return (
    <Select
      value={value !== undefined ? String(value) : ""}
      onValueChange={(val) => onChange(Number(val))}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full cursor-pointer ${className}`}>
        <SelectValue placeholder="Selecione..." />
      </SelectTrigger>

      <SelectContent>
        {prices.map((price) => (
          <SelectItem
            key={price.id}
            value={String(price.m3Volume)}
            className="cursor-pointer"
          >
            {price.m3Volume === 0 ? "Depósito" : `${price.m3Volume} m³`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
