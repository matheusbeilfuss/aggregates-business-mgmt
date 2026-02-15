import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "O usuário é obrigatório" })
    .min(5, "O usuário deve ter pelo menos 5 caracteres"),
  password: z
    .string({ required_error: "A senha é obrigatória" })
    .min(5, "A senha deve ter pelo menos 5 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
