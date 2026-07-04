import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { name, full_name, service_name } from "@/lib/config/app";
import Header from "@/components/Header";
import type { Metadata, Viewport } from "next";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${service_name}`,
  description: `${name.toUpperCase().split("").join(".")}. - ${full_name.join(" ")}`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
