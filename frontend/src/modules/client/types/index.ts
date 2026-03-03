export type PhoneType = "WHATSAPP" | "CELULAR" | "FIXO" | "OUTRO";

export interface Client {
  id: number;
  name: string;
  cpfCnpj: string;
  email: string;
  address?: Address;
  phones: Phone[];
}

export interface Phone {
  id: number;
  number: string;
  type: PhoneType;
}

export interface Address {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Payloads para API

export interface CreatePhonePayload {
  number: string;
  type: PhoneType;
}

export interface CreateClientPayload {
  name: string;
  cpfCnpj?: string;
  phones: CreatePhonePayload[];
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}
