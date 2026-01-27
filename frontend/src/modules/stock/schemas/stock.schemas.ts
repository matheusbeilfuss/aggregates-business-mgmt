import { z } from "zod";

export const productSchema = z
  .object({
    name: z.string().min(1, "O nome do produto é obrigatório."),
    categoryId: z.number().optional(),
    categoryName: z.string().optional(),
    isNewCategory: z.boolean(),
  })
  .refine(
    (data) =>
      (data.isNewCategory && !!data.categoryName?.trim()) ||
      (!data.isNewCategory && !!data.categoryId),
    {
      message:
        "Informe uma categoria existente ou o nome de uma nova categoria.",
      path: ["isNewCategory"],
    },
  );

export type ProductFormData = z.infer<typeof productSchema>;

export const editStockSchema = z.object({
  productName: z.string().min(1, "Nome obrigatório"),
  categoryId: z.number({ required_error: "Categoria obrigatória" }),
  tonQuantity: z.coerce
    .number()
    .nonnegative("Quantidade não pode ser negativa"),
  m3Quantity: z.coerce.number().nonnegative("Quantidade não pode ser negativa"),
});

export type EditStockFormData = z.infer<typeof editStockSchema>;

export const replenishSchema = z.object({
  supplierId: z.number().min(1, "Selecione um fornecedor"),
  density: z.coerce.number().min(0.001, "Densidade inválida"),
  tonQuantity: z.coerce.number().min(0.01, "Quantidade inválida"),
  m3Quantity: z.coerce.number().min(0.01, "Quantidade inválida"),
  expenseValue: z.coerce.number().min(0, "Valor inválido"),
  paymentStatus: z.enum(["PAID", "PENDING"]),
});

export type ReplenishFormData = z.infer<typeof replenishSchema>;
