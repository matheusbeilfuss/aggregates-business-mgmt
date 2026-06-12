import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { Category } from "@/modules/category/types";
import { cn } from "@/lib/utils";

interface CategorySelectProps {
  value?: number;
  onChange: (value: number) => void;
  categories: Category[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  categories,
  placeholder = "Selecione...",
  disabled = false,
  className,
}: CategorySelectProps) {
  return (
    <Select
      value={value?.toString() ?? ""}
      onValueChange={(val) => onChange(Number(val))}
      disabled={disabled}
    >
      <FormControl>
        <SelectTrigger className={cn("w-full cursor-pointer", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {[...categories]
          .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
          .map((category) => (
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
