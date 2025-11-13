import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthLayoutWrapper from "@/components/AuthLayoutWrapper";
import { QueryProvider } from "@/presentation/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Mina - Your AI Voice Assistant",
  description: "Talk naturally with AI assistants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
