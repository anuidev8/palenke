import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Plataforma Palenke | MVP mockup blueprint",
  description:
    "Mock interactivo del MVP Palenke con flujo público, interno y panel administrativo basado en el blueprint de diseño.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${publicSans.variable} ${fraunces.variable} antialiased`}>{children}</body>
    </html>
  );
}

