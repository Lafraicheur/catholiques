import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Église Catholique",
  description: "Gestion administrative pour l'Église Catholique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          theme="light"
        />
      </body>
    </html>
  );
}