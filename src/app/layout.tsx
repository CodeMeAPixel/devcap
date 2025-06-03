import { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Developer Capitalist - Code Your Way to Fortune",
  description:
    "An idle clicker game where you write code, build businesses, and become a tech mogul",
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} antialiased min-h-screen tech-ui`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
