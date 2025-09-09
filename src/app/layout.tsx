import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/lib/ClientWrapper";
import Header from "@/components/Header/Header";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "FeelingTracker",
  description:
    "Track your feelings day to day and see how you reported with charts and calender from your dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${sourceSerif4.variable} ${jetBrainsMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
