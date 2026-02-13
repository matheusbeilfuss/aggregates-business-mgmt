import { Phone } from "../types";

export function selectPreferredPhone(phones: Phone[]): Phone | null {
  if (phones.length === 0) {
    return null;
  }

  const whatsappPhone = phones.find((phone) => phone.type === "WHATSAPP");
  if (whatsappPhone) {
    return whatsappPhone;
  }

  const celularPhone = phones.find((phone) => phone.type === "CELULAR");
  if (celularPhone) {
    return celularPhone;
  }

  return phones[0];
}
