import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHONE_TYPES, PhoneType } from "@/modules/client/types";
import { phoneTypeLabel } from "@/modules/client/utils/labels";

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
      value={value ?? ""}
      onValueChange={(val) => onChange(val as PhoneType)}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full cursor-pointer ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {PHONE_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            {phoneTypeLabel[type]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
