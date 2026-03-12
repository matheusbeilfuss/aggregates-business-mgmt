import { z } from "zod";
import { PaymentMethodEnum } from "@/types";

export const paymentSchema = z.object({
  paymentValue: z.coerce
    .number({ invalid_type_error: "O valor é obrigatório." })
    .positive("O valor deve ser maior que zero."),
  paymentMethod: z.nativeEnum(PaymentMethodEnum, {
    errorMap: () => ({ message: "O método de pagamento é obrigatório." }),
  }),
  date: z.string().min(1, "A data é obrigatória."),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
