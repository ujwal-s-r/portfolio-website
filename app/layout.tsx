import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ujwal S R — Developer Portfolio",
  description: "Personal portfolio of Ujwal S R, a software developer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">{children}</body>
    </html>
  );
}
