import z from "zod";

export const userInfosEditSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.email("E-mail inválido"),
  image: z.any().optional(),
});

export type UserInfosEditFormData = z.infer<typeof userInfosEditSchema>;