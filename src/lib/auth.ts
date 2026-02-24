import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "TEMP_KEY");

export const auth = betterAuth({
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BASE_URL!,
    "http://localhost:3000",
    "http://192.168.0.5:3000",
  ],
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      if (!process.env.RESEND_API_KEY) {
        console.error("ERRO: RESEND_API_KEY não configurada no .env.local");
        return;
      }
      
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/login/reset-password?token=${data.token}`;
       
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.user.email,
        subject: "Redefinição de Senha",
        html: `<p>Clique <a href="${url}">aqui</a> para resetar sua senha.</p>`,
      });
    }
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },
    },
  },
});
