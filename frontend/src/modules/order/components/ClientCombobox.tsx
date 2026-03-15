import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Client } from "@/modules/client/types";
import { useClientSearch } from "@/modules/client/hooks";

interface ClientComboboxProps {
  value: string;
  clientId?: number;
  className?: string;
  onChange: (value: string) => void;
  onClientSelect: (client: Client) => void;
}

export function ClientCombobox({
  value,
  clientId,
  className,
  onChange,
  onClientSelect,
}: ClientComboboxProps) {
  const { results, loading } = useClientSearch(value);

  return (
    <Combobox
      value={clientId ? String(clientId) : ""}
      onValueChange={(val) => {
        const client = results.find((c) => String(c.id) === val);
        if (client) onClientSelect(client);
      }}
    >
      <ComboboxInput
        className={className}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busque ou digite o nome do cliente"
      />
      <ComboboxContent>
        {loading ? (
          <ComboboxEmpty>Buscando...</ComboboxEmpty>
        ) : results.length === 0 ? (
          <ComboboxEmpty>
            {value.trim().length < 3
              ? "Digite pelo menos 3 caracteres"
              : "Novo cliente"}
          </ComboboxEmpty>
        ) : (
          <ComboboxList>
            {results.map((client) => (
              <ComboboxItem key={client.id} value={String(client.id)}>
                {client.name}
              </ComboboxItem>
            ))}
          </ComboboxList>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
