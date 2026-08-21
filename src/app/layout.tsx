import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Applied Systems Research & Technology | AI, ML, Robotics & Software",
  description:
    "Applied Systems Research & Technology (OPC) Pvt Ltd — an applied AI research company that turns difficult problems into engineered systems.",
  icons: {
    icon: [{ url: "/brand-logo.jpeg", type: "image/jpeg" }],
  },
  keywords: [
    "Applied System Research Technology",
    "AI company Bangalore",
    "Machine Learning",
    "Robotics",
    "Software Engineering",
    "Applied AI Research",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080808] text-[#F5F5F5]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
