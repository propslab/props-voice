import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Props Voice｜QRを置くだけで、来店客の声が積み上がる",
  description:
    "Props Voice は中小店舗向けの無料口コミ収集ツールです。QRコードを置くだけで、来店客の一言を AI が自然な Google レビュー文に整え、店舗の集客を後押しします。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://voice.props-lab.jp"
  ),
  openGraph: {
    title: "Props Voice｜QRを置くだけで、来店客の声が積み上がる",
    description:
      "中小店舗向けの無料口コミ収集ツール。Props Lab が提供します。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
