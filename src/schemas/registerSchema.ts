import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "O campo de nome é obrigatório"),
  email: z.string().email("O formato do e-mail é inválido").min(1, "O campo de e-mail é obrigatório"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"], 
});

export type RegisterFormData = z.infer<typeof registerSchema>;