import { z } from "zod";

export const orderSchema = z
  .object({
    productId: z.number().optional(),
    clientId: z.number().optional(),
    clientName: z.string().optional(),
    phone: z.string().min(1, "Telefone obrigatório"),
    cpfCnpj: z.string().min(1, "CPF/CNPJ obrigatório"),
    street: z.string().min(1, "Rua obrigatória"),
    number: z.string().min(1, "Número obrigatório"),
    neighborhood: z.string().min(1, "Bairro obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    state: z.string().min(2, "Estado obrigatório"),
    quantity: z.coerce.number().nonnegative("Quantidade inválida").optional(),
    service: z.string().optional(),
    type: z.enum(["MATERIAL", "SERVICE"]),
    scheduledDate: z.string().min(1, "Data agendada obrigatória"),
    scheduledTime: z.string().min(1, "Hora agendada obrigatória"),
    observations: z.string().optional(),
    orderValue: z.coerce.number().min(0, "Valor do pedido inválido"),
  })
  .refine(
    (data) =>
      (data.type === "MATERIAL" ? data.productId !== undefined : true) ||
      (data.type === "SERVICE" ? data.service !== undefined : true),
    {
      message: "Produto ou serviço obrigatório conforme o tipo do pedido.",
      path: ["productId", "service"],
    },
  )
  .refine((data) => data.clientId !== undefined || !!data.clientName?.trim(), {
    message: "Informe um cliente existente ou o nome de um novo cliente.",
    path: ["clientId", "clientName"],
  });

export type OrderFormData = z.infer<typeof orderSchema>;
