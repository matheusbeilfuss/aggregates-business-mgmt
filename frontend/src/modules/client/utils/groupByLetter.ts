import { Client } from "../types";

export function groupByLetter(clients: Client[]): Record<string, Client[]> {
  return clients.reduce<Record<string, Client[]>>((acc, client) => {
    const trimmedName = client.name.trim();
    if (!trimmedName) return acc;

    const letter = trimmedName[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(client);
    return acc;
  }, {});
}
