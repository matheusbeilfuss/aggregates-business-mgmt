import { FormControl } from "@/components/ui/form";
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
  onChange: (value: number) => void;
  products: Product[];
  placeholder?: string;
  disabled?: boolean;
}

export function ProductSelect({
  value,
  onChange,
  products,
  placeholder = "Selecione...",
  disabled = false,
}: ProductSelectProps) {
  return (
    <Select
      value={value?.toString() ?? ""}
      onValueChange={(val) => onChange(Number(val))}
      disabled={disabled}
    >
      <FormControl>
        <SelectTrigger className="w-full cursor-pointer">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
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
