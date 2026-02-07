import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/modules/stock/types";

interface ProductSelectProps {
  value?: number;
  products: Product[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: number) => void;
}

export function ProductSelect({
  value,
  products,
  placeholder = "Selecione...",
  disabled = false,
  className,
  onChange,
}: ProductSelectProps) {
  return (
    <Select
      value={value?.toString() ?? ""}
      onValueChange={(val) => onChange(Number(val))}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full cursor-pointer ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {products.map((product) => (
          <SelectItem
            key={product.id}
            value={String(product.id)}
            className="cursor-pointer"
          >
            {product.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
