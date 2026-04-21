import { z } from "zod";
import { PHONE_TYPES } from "../types";

const phoneSchema = z.object({
  number: z.string().min(1, "Telefone obrigatório"),
  type: z.enum(PHONE_TYPES, { required_error: "Tipo obrigatório" }),
});

export const clientSchema = z
  .object({
    name: z.string().trim().min(1, "Nome obrigatório"),
    cpfCnpj: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    phones: z.array(phoneSchema).min(1, "Pelo menos um telefone é obrigatório"),
    cep: z.string().optional(),
    street: z.string().optional().default(""),
    number: z.string().optional().default(""),
    complement: z.string().optional(),
    neighborhood: z.string().optional().default(""),
    city: z.string().optional().default(""),
    state: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    const fields = [
      data.street,
      data.number,
      data.neighborhood,
      data.city,
      data.state,
      data.cep,
      data.complement,
    ];
    const hasAny = fields.some((f) => f && f.trim().length > 0);
    if (!hasAny) return;

    if (!data.street?.trim())
      ctx.addIssue({
        code: "custom",
        message: "Rua obrigatória",
        path: ["street"],
      });
    if (!data.number?.trim())
      ctx.addIssue({
        code: "custom",
        message: "Número obrigatório",
        path: ["number"],
      });
    if (!data.neighborhood?.trim())
      ctx.addIssue({
        code: "custom",
        message: "Bairro obrigatório",
        path: ["neighborhood"],
      });
    if (!data.city?.trim())
      ctx.addIssue({
        code: "custom",
        message: "Cidade obrigatória",
        path: ["city"],
      });
    if (!data.state || data.state.trim().length < 2)
      ctx.addIssue({
        code: "custom",
        message: "Estado obrigatório",
        path: ["state"],
      });
  });

export type ClientFormData = z.infer<typeof clientSchema>;
