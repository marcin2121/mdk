import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import fs from "fs";
import path from "path";
import SetupWizard from "../components/wizard/setup-wizard";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Molenda Boilerplate | Niezwykle szybkie strony internetowe",
  description: "Molenda Boilerplate to potężny, nowoczesny szablon startowy Next.js 16 dla agencji i freelancerów. Niezawodne rozwiązanie osiągające 100/100 Core Web Vitals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // META CHECK: Funkcja Node.js badająca strukturę plików katalogu roboczego (działa w SSR / Server Component)
  // Szuka pliku .molenda-setup. Jeśli go nie ma, wstrzymuje render aplikacji i odpala Kreator!
  const isSetupComplete = fs.existsSync(path.join(process.cwd(), '.molenda-setup'));

  if (!isSetupComplete) {
    return (
      <html lang="pl" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
           <SetupWizard />
        </body>
      </html>
    );
  }

  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
