import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" || "http://192.168.0.5:3000"
});

export const { signIn, signUp, signOut, useSession } = authClient;
