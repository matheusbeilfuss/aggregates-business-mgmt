import { z } from "zod";

const baseSchema = z.object({
  tonCost: z.coerce
    .number({ invalid_type_error: "Informe um valor válido." })
    .positive("O custo por tonelada deve ser maior que zero."),
  costPerCubicMeter: z.coerce
    .number({ invalid_type_error: "Informe um valor válido." })
    .positive("O custo por m³ deve ser maior que zero."),
  costFor5CubicMeters: z.coerce
    .number({ invalid_type_error: "Informe um valor válido." })
    .positive("O custo por 5m³ deve ser maior que zero."),
  density: z.coerce
    .number({ invalid_type_error: "Informe um valor válido." })
    .positive("A densidade deve ser maior que zero."),
  observations: z.string().optional(),
});

export const supplierAddSchema = baseSchema
  .extend({
    productId: z
      .number({ required_error: "Selecione um produto." })
      .min(1, "Selecione um produto."),
    supplierId: z.number().optional(),
    supplierName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.supplierId && !data.supplierName?.trim()) {
      ctx.addIssue({
        path: ["supplierName"],
        message: "Selecione ou informe o nome do fornecedor.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const supplierEditSchema = baseSchema.extend({
  supplierId: z.number({ required_error: "Selecione um fornecedor." }).min(1),
  productId: z.number({ required_error: "Selecione um produto." }).min(1),
});

export type SupplierAddFormData = z.infer<typeof supplierAddSchema>;
export type SupplierEditFormData = z.infer<typeof supplierEditSchema>;
