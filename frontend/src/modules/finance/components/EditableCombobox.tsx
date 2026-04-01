import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  value: string;
  options: string[];
  placeholder?: string;
  className?: string;
  "aria-invalid"?: boolean;
  onChange: (value: string) => void;
};

export function EditableCombobox({
  value,
  options,
  placeholder,
  className,
  "aria-invalid": ariaInvalid,
  onChange,
}: Props) {
  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(value.toLowerCase())),
    [options, value],
  );

  return (
    <Combobox value={value} onValueChange={(val) => onChange(val ?? "")}>
      <ComboboxInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(className)}
        aria-invalid={ariaInvalid}
      />
      <ComboboxContent>
        <ComboboxList>
          {filtered.length === 0 && value.trim() !== "" && (
            <ComboboxEmpty>Novo registro.</ComboboxEmpty>
          )}
          {filtered.map((opt) => (
            <ComboboxItem key={opt} value={opt}>
              {opt}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
