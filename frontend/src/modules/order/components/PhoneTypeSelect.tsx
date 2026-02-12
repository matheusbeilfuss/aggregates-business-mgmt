import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneType } from "../types";

interface PhoneTypeSelectProps {
  value?: PhoneType;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: PhoneType) => void;
}

export function PhoneTypeSelect({
  value,
  placeholder = "Selecione...",
  disabled = false,
  className,
  onChange,
}: PhoneTypeSelectProps) {
  return (
    <Select
      value={value?.toString() ?? ""}
      onValueChange={(val) => onChange(val as PhoneType)}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full cursor-pointer ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
        <SelectItem value="CELULAR">Celular</SelectItem>
        <SelectItem value="FIXO">Fixo</SelectItem>
        <SelectItem value="OUTRO">Outro</SelectItem>
      </SelectContent>
    </Select>
  );
}
