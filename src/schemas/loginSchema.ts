import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caractéres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;