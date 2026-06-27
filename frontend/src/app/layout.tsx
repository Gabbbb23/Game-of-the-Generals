import type { Metadata } from "next";
import { Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Game of the Generals",
  description: "Modern matte-maroon Game of the Generals interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
