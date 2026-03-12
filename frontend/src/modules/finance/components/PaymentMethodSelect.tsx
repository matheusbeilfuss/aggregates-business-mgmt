import { PaymentMethodEnum } from "@/types";
import { paymentMethodLabel } from "@/modules/finance/utils/labels";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  value: PaymentMethodEnum | "";
  onChange: (value: PaymentMethodEnum) => void;
};

export function PaymentMethodSelect({ value, onChange }: Props) {
  return (
    <Select
      onValueChange={(v) => onChange(v as PaymentMethodEnum)}
      value={value}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um método de pagamento" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(PaymentMethodEnum).map((method) => (
          <SelectItem key={method} value={method}>
            {paymentMethodLabel[method]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
