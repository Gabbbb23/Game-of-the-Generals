import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
