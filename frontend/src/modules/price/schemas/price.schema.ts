import { z } from "zod";

const priceErrorMessage = "Preço deve ser maior que zero.";

export const priceUpdateSchema = z.object({
  deposito: z.coerce.number().positive(priceErrorMessage),
  m3_1: z.coerce.number().positive(priceErrorMessage),
  m3_2: z.coerce.number().positive(priceErrorMessage),
  m3_3: z.coerce.number().positive(priceErrorMessage),
  m3_4: z.coerce.number().positive(priceErrorMessage),
  m3_5: z.coerce.number().positive(priceErrorMessage),
});

export type PriceUpdateFormData = z.infer<typeof priceUpdateSchema>;
