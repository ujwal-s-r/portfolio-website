import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ujwal-portfolio.vercel.app"
  ),
  title: {
    default: "Ujwal S R — Developer & AI Researcher",
    template: "%s | Ujwal S R",
  },
  description:
    "Personal portfolio of Ujwal S R — AI/ML Researcher, Multi-Agent RL & Full-Stack Developer.",
  icons: {
    icon: "/vercel.svg",
    shortcut: "/vercel.svg",
    apple: "/vercel.svg",
  },
  openGraph: {
    title: "Ujwal S R — Developer & AI Researcher",
    description:
      "Multi-Agent RL benchmarks, LLM Transformer reasoning research, and Full-Stack development.",
    siteName: "Ujwal S R Portfolio",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "Ujwal S R Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ujwal S R — Developer & AI Researcher",
    description:
      "Multi-Agent RL benchmarks, LLM Transformer reasoning research, and Full-Stack development.",
    images: ["/vercel.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://ps2zjncditdyfyag.public.blob.vercel-storage.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://ps2zjncditdyfyag.public.blob.vercel-storage.com"
        />
      </head>
      <body className="bg-black min-h-screen">{children}</body>
    </html>
  );
}
