// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BASE_URL!,
    "http://localhost:3000",
    "http://192.168.0.5:3000",
  ],
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 20,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
