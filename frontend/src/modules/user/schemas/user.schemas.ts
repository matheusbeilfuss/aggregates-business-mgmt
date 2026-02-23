import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "O nome é obrigatório."),
  lastName: z.string().min(1, "O sobrenome é obrigatório."),
  username: z.string().min(1, "O nome de usuário é obrigatório."),
  email: z.string().email("E-mail inválido."),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const createUserSchema = updateUserSchema.extend({
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres."),
  admin: z.boolean(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updatePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "A nova senha deve conter no mínimo 8 caracteres."),
    confirmPassword: z
      .string()
      .min(8, "A confirmação de senha deve conter no mínimo 8 caracteres."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
