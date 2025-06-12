import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./lib/auth";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

const geist = Geist({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-geist'
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: {
    default: "Funds Haven - Take Control of Your Financial Future",
    template: "%s | Funds Haven"
  },
  description: "Transform your relationship with money. Track expenses, set budgets, and achieve your financial goals with our intelligent platform designed for modern life.",
  keywords: ["finance", "budgeting", "expense tracking", "financial planning", "money management"],
  authors: [{ name: "Funds Haven Team" }],
  openGraph: {
    title: "Funds Haven - Your Financial Command Center",
    description: "Take control of your financial future with intelligent tracking and budgeting tools.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Funds Haven - Financial Management Made Simple",
    description: "Transform your relationship with money with our intelligent platform.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" }
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${inter.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="font-inter antialiased">
        <AuthSessionProvider session={session}>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
