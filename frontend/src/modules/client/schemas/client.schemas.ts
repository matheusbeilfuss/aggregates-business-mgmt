import { z } from "zod";
import { PHONE_TYPES } from "../types";

const phoneSchema = z.object({
  number: z.string().min(1, "Telefone obrigatório"),
  type: z.enum(PHONE_TYPES, { required_error: "Tipo obrigatório" }),
});

export const clientSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  cpfCnpj: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phones: z.array(phoneSchema).min(1, "Pelo menos um telefone é obrigatório"),
  street: z.string().min(1, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  neighborhood: z.string().min(1, "Bairro obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
});

export type ClientFormData = z.infer<typeof clientSchema>;
