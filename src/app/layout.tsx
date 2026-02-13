import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Plataforma Palenke | Infraestructura digital para pensar y defender el territorio",
  description: "Propuesta de MVP afroterritorial, construida con el PCN y sus comunidades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${syne.variable} font-sans bg-[#FFF8EA] text-[#1E1E1E] antialiased`}>
        {children}
      </body>
    </html>
  );
}
