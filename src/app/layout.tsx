import type { Metadata } from "next";
import { Nova_Square } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../contexts/ToastContext";
import { AuthInitializer } from "../components/auth/AuthInitializer";
import { ThemeProvider } from "../contexts/ThemeProvider";
import { getUserSystemTheme } from "../services/users";

const novaSquare = Nova_Square({
  variable: "--font-nova-square",
  weight: "400",
})

export const metadata: Metadata = {
  title: "Lehinmanagemen'",
  description: "Best management site ever exist",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const systemTheme = await getUserSystemTheme();

  return (
    <html lang="pt-BR" >
      <body
        className={`${novaSquare.className} antialiased`}
        suppressHydrationWarning
      >   
        <ToastProvider>
          <AuthInitializer>
            <ThemeProvider initialDark={systemTheme} />
            {children}
          </AuthInitializer>
        </ToastProvider>
      </body>
    </html>
  );
}
