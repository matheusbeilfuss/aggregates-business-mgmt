import { z } from "zod";
export const orderSchema = z
  .object({
    productId: z.number().optional(),
    clientId: z.number().optional(),
    clientName: z.string().optional(),
    phone: z
      .string({ required_error: "Telefone obrigatório" })
      .min(1, "Telefone obrigatório"),
    cpfCnpj: z
      .string({ required_error: "CPF/CNPJ obrigatório" })
      .min(1, "CPF/CNPJ obrigatório"),
    street: z
      .string({ required_error: "Rua obrigatória" })
      .min(1, "Rua obrigatória"),
    number: z
      .string({ required_error: "Número obrigatório" })
      .min(1, "Número obrigatório"),
    neighborhood: z
      .string({ required_error: "Bairro obrigatório" })
      .min(1, "Bairro obrigatório"),
    city: z
      .string({ required_error: "Cidade obrigatória" })
      .min(1, "Cidade obrigatória"),
    state: z
      .string({ required_error: "Estado obrigatório" })
      .min(2, "Estado obrigatório"),
    quantity: z.coerce
      .number({ invalid_type_error: "Quantidade obrigatória" })
      .positive("Quantidade obrigatória")
      .optional(),
    service: z.string().optional(),
    type: z.enum(["MATERIAL", "SERVICE"]),
    scheduledDate: z
      .string({ required_error: "Data obrigatória" })
      .min(1, "Data agendada obrigatória"),
    scheduledTime: z
      .string({ required_error: "Hora obrigatória" })
      .min(1, "Hora agendada obrigatória"),
    observations: z.string().optional(),
    orderValue: z.preprocess(
      (val) => (val === "" || val === null ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: "Valor do pedido inválido",
          required_error: "Valor do pedido obrigatório",
        })
        .positive("Valor do pedido inválido"),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.clientId && !data.clientName?.trim()) {
      ctx.addIssue({
        path: ["clientName"],
        message: "Cliente obrigatório",
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.type === "MATERIAL") {
      if (!data.productId) {
        ctx.addIssue({
          path: ["productId"],
          message: "Material obrigatório",
          code: z.ZodIssueCode.custom,
        });
      }
      if (data.type === "MATERIAL" && data.quantity == null) {
        ctx.addIssue({
          path: ["quantity"],
          message: "Quantidade obrigatória",
          code: z.ZodIssueCode.custom,
        });
      }
    }
    if (data.type === "SERVICE") {
      if (!data.service || !data.service.trim()) {
        ctx.addIssue({
          path: ["service"],
          message: "Serviço obrigatório",
          code: z.ZodIssueCode.custom,
        });
      }
    }
    if (!data.orderValue || data.orderValue <= 0) {
      ctx.addIssue({
        path: ["orderValue"],
        message: "Valor do pedido inválido",
        code: z.ZodIssueCode.custom,
      });
    }
  });
export type OrderFormData = z.infer<typeof orderSchema>;
