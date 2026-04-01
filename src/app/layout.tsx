import type { Metadata } from "next";
import { DM_Serif_Display, Source_Sans_3 } from "next/font/google";
import { Suspense } from "react";
import GlobalBibliotecaSearchDock from "@/components/palenke/GlobalBibliotecaSearchDock";
import { getVisibleDocuments } from "@/lib/mock-data";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Palenke Pensamiento | Proceso de Comunidades Negras",
  description:
    "Casa digital del Proceso de Comunidades Negras — política, comunitaria, territorial.",
};

const globalSearchDocuments = getVisibleDocuments("public").toSorted((a, b) => b.year - a.year);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${sourceSans3.variable} ${dmSerifDisplay.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Suspense fallback={null}>
           
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
