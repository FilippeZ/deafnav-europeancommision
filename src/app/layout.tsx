import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-public-sans"
});

export const metadata: Metadata = {
  title: "DeafNav Hub | HD Unified Interface",
  description: "Next-generation accessibility platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
      </head>
      <body className={cn(
        inter.variable,
        publicSans.variable,
        "font-sans antialiased text-slate-900 dark:text-slate-100"
      )} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
