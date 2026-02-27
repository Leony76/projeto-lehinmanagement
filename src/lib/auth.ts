import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "TEMP_KEY");

export const auth = betterAuth({
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL!,
    "http://localhost:3000",
    "http://192.168.0.5:3000",
    "https://unvascularly-unriskable-mable.ngrok-free.dev"
  ],

  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      if (!process.env.RESEND_API_KEY) {
        console.error("ERRO: RESEND_API_KEY não configurada no .env.local");
        return;
      }
      
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/login/reset-password?token=${data.token}`;
       
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.user.email,
        subject: "Redefinição de senha",
        html: `
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px;">
            <tr>
              <td align="center">
                <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:24px;font-family:Arial,sans-serif;">
                  <tr>
                    <td align="center">
                      <table cellpadding="0" cellspacing="0" align="center">
                        <tr>
                          <td align="center">
                            <img 
                              src="https://res.cloudinary.com/dnw6pr1jn/image/upload/v1772027295/lehinmanagement-products/ya6cej3taqdumdto44xq.png" 
                              width="70" 
                              alt="LRC" 
                              style="display:block;margin:0 auto;"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-top: 6px;">
                            <span style="
                              color:#ff8040;
                              font-style:italic;
                              font-weight:bold;
                              font-family:Arial, sans-serif;
                              font-size:14px;
                            ">
                              Lehinmanagemen'
                            </span>
                          </td>
                        </tr>
                      </table>
                    
                      <h2 style="color:#ff8040;margin:16px 0 8px;font-family:Arial,sans-serif;">
                        Redefinir senha
                      </h2>
                      <p style="color:#3baea6; font-size:14px;">
                        Você tem <b>60 minutos</b> para redefinir sua senha.
                      </p>
                      <a href="${url}" style="
                        display:inline-block;
                        margin-top:16px;
                        padding:10px 20px;
                        background: #fae6c4;
                        color: #ff8040;
                        text-decoration:none;
                        border-radius:30px;
                        border: 1px solid #ff8040;
                      ">
                        Redefinir senha
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `,
      });
    }
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

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
