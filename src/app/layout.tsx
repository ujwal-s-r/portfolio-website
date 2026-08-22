import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "../../data/site-config";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: siteConfig.bio,
  keywords: [
    "AI Engineer",
    "ML Systems",
    "CUDA",
    "Data Engineer",
    "PyTorch",
    "Triton",
    "LLM Inference",
    "Distributed Systems",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.bio,
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-text-primary min-h-screen flex flex-col antialiased selection:bg-accent selection:text-[#0a0a0a]">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
