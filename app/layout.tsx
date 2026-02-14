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
  title: {
    default: "林林多喝水",
    template: "%s | 林林多喝水",
  },
  description: "Designer & Storyteller - 一个关于设计、生活、技艺和阅读的个人博客",
  keywords: ["设计", "博客", "生活", "技艺", "阅读", "个人博客", "林林多喝水"],
  authors: [{ name: "林林" }],
  creator: "林林",
  publisher: "林林",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://blog.f-free.site",
    title: "林林多喝水",
    description: "Designer & Storyteller - 一个关于设计、生活、技艺和阅读的个人博客",
    siteName: "林林多喝水",
  },

  // Twitter
  twitter: {
    card: "summary",
    title: "林林多喝水",
    description: "Designer & Storyteller - 一个关于设计、生活、技艺和阅读的个人博客",
    creator: "@lilin",
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  // Manifest
  manifest: "/manifest.json",

  // Verification and other meta tags
  metadataBase: new URL("https://blog.f-free.site"),
  alternates: {
    canonical: "/",
  },
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
