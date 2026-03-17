export const PHONE_TYPES = ["WHATSAPP", "CELULAR", "FIXO", "OUTRO"] as const;
export type PhoneType = (typeof PHONE_TYPES)[number];

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
  cep?: string;
  street: string;
  number: string;
  complement?: string;
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
  email?: string;
  phones: CreatePhonePayload[];
  cep?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}
