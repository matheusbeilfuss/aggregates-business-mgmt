import { stripNonDigits } from "@/utils";
import { Phone } from "../types";

export function getPhoneHref(phone: Phone): string {
  const digits = stripNonDigits(phone.number);
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  if (phone.type === "WHATSAPP") return `https://wa.me/${withCountry}`;
  return `tel:+${withCountry}`;
}

export function getPhoneLabel(phone: Phone): string {
  if (phone.type === "WHATSAPP") return "WhatsApp";
  return "Ligar";
}

interface AddressLike {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export function getMapsHref(address: AddressLike): string {
  const query = [
    address.street,
    address.number,
    address.complement,
    address.neighborhood,
    address.city,
    address.state,
  ]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
