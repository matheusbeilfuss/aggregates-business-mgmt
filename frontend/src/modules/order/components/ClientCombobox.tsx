import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Client } from "../types";
import { useMemo } from "react";

interface ClientComboboxProps {
  value: string;
  clientId?: number;
  clients: Client[];
  className?: string;
  onChange: (value: string) => void;
  onClientSelect: (client: Client) => void;
}

export function ClientCombobox({
  value,
  clientId,
  clients,
  className,
  onChange,
  onClientSelect,
}: ClientComboboxProps) {
  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(value.toLowerCase()),
    );
  }, [clients, value]);

  return (
    <Combobox
      value={clientId ? String(clientId) : ""}
      onValueChange={(val) => {
        const client = clients.find((c) => String(c.id) === val);
        if (client) {
          onClientSelect(client);
        }
      }}
    >
      <ComboboxInput
        className={className}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busque ou digite o nome do cliente"
      />
      <ComboboxContent>
        {filteredClients.length === 0 && (
          <ComboboxEmpty>Novo cliente</ComboboxEmpty>
        )}
        <ComboboxList>
          {filteredClients.map((client) => (
            <ComboboxItem key={client.id} value={String(client.id)}>
              {client.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
