import { Phone } from "../modules/client/types";

export function selectPrimaryPhone(phones: Phone[]): Phone | null {
  if (phones.length === 0) return null;

  return (
    phones.find((p) => p.type === "WHATSAPP") ??
    phones.find((p) => p.type === "CELULAR") ??
    phones[0]
  );
}
