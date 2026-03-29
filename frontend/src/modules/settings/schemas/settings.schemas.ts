import { z } from "zod";

export const settingsSchema = z.object({
  businessName: z.string().min(1, "O nome do comércio é obrigatório."),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
