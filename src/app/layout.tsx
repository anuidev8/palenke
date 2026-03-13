import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import { Suspense } from "react";
import GlobalBibliotecaSearchDock from "@/components/palenke/GlobalBibliotecaSearchDock";
import { getVisibleDocuments } from "@/lib/mock-data";
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

const globalSearchDocuments = getVisibleDocuments("public").toSorted((a, b) => b.year - a.year);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${publicSans.variable} ${fraunces.variable} antialiased`}>
        {children}
        <Suspense fallback={null}>
          <GlobalBibliotecaSearchDock documents={globalSearchDocuments} />
        </Suspense>
      </body>
    </html>
  );
}
