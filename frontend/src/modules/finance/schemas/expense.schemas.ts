import { z } from "zod";
import { ExpenseTypeEnum, PaymentStatusEnum } from "@/types";

export const expenseSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório."),
    expenseValue: z.coerce
      .number({ invalid_type_error: "O valor é obrigatório." })
      .positive("O valor deve ser maior que zero."),
    date: z.string().min(1, "A data é obrigatória."),
    category: z.string().min(1, "A categoria é obrigatória."),
    paymentStatus: z.nativeEnum(PaymentStatusEnum, {
      required_error: "O status de pagamento é obrigatório.",
    }),
    dueDate: z.string().nullable().optional(),
    type: z.nativeEnum(ExpenseTypeEnum, {
      required_error: "O tipo é obrigatório.",
    }),
    vehicle: z.string().nullable().optional(),
    kmDriven: z.coerce.number().nullable().optional(),
    liters: z.coerce.number().nullable().optional(),
    pricePerLiter: z.coerce.number().nullable().optional(),
    fuelSupplier: z.string().nullable().optional(),
    paymentDate: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === ExpenseTypeEnum.FUEL) {
      if (!data.vehicle || data.vehicle.trim() === "") {
        ctx.addIssue({
          path: ["vehicle"],
          code: "custom",
          message: "O veículo é obrigatório.",
        });
      }
      if (!data.liters || data.liters <= 0) {
        ctx.addIssue({
          path: ["liters"],
          code: "custom",
          message: "A quantidade de litros é obrigatória.",
        });
      }
      if (!data.pricePerLiter || data.pricePerLiter <= 0) {
        ctx.addIssue({
          path: ["pricePerLiter"],
          code: "custom",
          message: "O valor do litro é obrigatório.",
        });
      }
      if (!data.kmDriven || data.kmDriven <= 0) {
        ctx.addIssue({
          path: ["kmDriven"],
          code: "custom",
          message: "Os quilômetros rodados são obrigatórios.",
        });
      }
    }
    if (data.paymentStatus === PaymentStatusEnum.PENDING && !data.dueDate) {
      ctx.addIssue({
        path: ["dueDate"],
        code: "custom",
        message: "A data de vencimento é obrigatória para pagamento pendente.",
      });
    }
  });

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
