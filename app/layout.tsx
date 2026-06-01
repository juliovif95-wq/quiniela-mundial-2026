import type { Metadata } from "next";
import { Geist, Oswald } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Quiniela Mundial 2026",
  description: "Adivina los resultados del Mundial 2026 y compite con tus compañeros",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${geist.className} ${oswald.variable} min-h-full bg-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
