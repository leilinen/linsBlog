import type { Metadata } from "next";
import { Merriweather_Sans, Open_Sans } from "next/font/google";
import "./globals.css";

const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-merriweather-sans",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "林林多喝水",
  description: "Designer & Storyteller",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${merriweatherSans.variable} ${openSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
