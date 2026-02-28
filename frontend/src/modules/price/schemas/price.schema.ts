import { z } from "zod";

export const priceUpdateSchema = z.object({
  prices: z.array(
    z.object({
      id: z.number(),
      m3Volume: z.number(),
      price: z
        .number({ invalid_type_error: "Informe um valor válido." })
        .positive({ message: "O preço deve ser maior que zero." }),
    }),
  ),
});

export type PriceUpdateSchema = z.infer<typeof priceUpdateSchema>;
