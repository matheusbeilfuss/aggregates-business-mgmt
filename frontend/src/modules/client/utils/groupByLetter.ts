import { Client } from "../types";

export function groupByLetter(clients: Client[]): Record<string, Client[]> {
  return clients.reduce<Record<string, Client[]>>((acc, client) => {
    const letter = client.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(client);
    return acc;
  }, {});
}
