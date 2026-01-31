import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import type { Category } from "../types";

interface CategorySelectProps {
  value?: number;
  onChange: (value: number) => void;
  categories: Category[];
  placeholder?: string;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onChange,
  categories,
  placeholder = "Selecione...",
  disabled = false,
}: CategorySelectProps) {
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
        {categories.map((category) => (
          <SelectItem
            key={category.id}
            value={String(category.id)}
            className="cursor-pointer"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
