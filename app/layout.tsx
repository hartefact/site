import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
  title: "HarteFact — AI Image & Video Quality Assurance",
  description:
    "Independent quality assurance and benchmarking for AI-generated visual content. A model-agnostic framework for measuring image, video, and print-ready output quality.",
  keywords: [
    "AI video QA",
    "AI image quality assurance",
    "generative content benchmarking",
    "AI artifact detection",
    "print-on-demand QA",
    "model-agnostic quality scoring",
  ],
  openGraph: {
    title: "HarteFact — AI Image & Video Quality Assurance",
    description:
      "Quality Management Tools and Benchmarking for the Digital Visual Arts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
