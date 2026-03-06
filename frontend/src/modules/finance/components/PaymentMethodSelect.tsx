import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function PaymentMethodSelect({ value, onChange }: Props) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um método de pagamento" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="CREDIT_CARD">Cartão de crédito</SelectItem>
        <SelectItem value="DEBIT_CARD">Cartão de débito</SelectItem>
        <SelectItem value="CASH">Dinheiro</SelectItem>
        <SelectItem value="PIX">PIX</SelectItem>
        <SelectItem value="BANK_TRANSFER">Transferência bancária</SelectItem>
        <SelectItem value="BANK_SLIP">Boleto bancário</SelectItem>
        <SelectItem value="CHECK">Cheque</SelectItem>
      </SelectContent>
    </Select>
  );
}
