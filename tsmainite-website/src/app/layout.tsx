import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/components/LoadingContext";
// import PageViewTracker from "@/components/PageViewTracker";  // 禁用：stats API 未启用

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "唐山迈尼特 - 工业电磁设备领先制造商",
  description: "专业从事电磁除铁器、电磁搅拌器、电缆卷筒等工业电磁设备的设计、制造与销售。25年行业经验，服务全球500+企业客户。",
  keywords: ["电磁除铁器", "电磁搅拌器", "工业电磁设备", "电缆卷筒", "液态金属泵"],
  authors: [{ name: "唐山迈尼特" }],
  creator: "唐山迈尼特",
  publisher: "唐山迈尼特",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://tsmainite.com"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://tsmainite.com",
    siteName: "唐山迈尼特",
    title: "唐山迈尼特 - 工业电磁设备领先制造商",
    description: "专业从事电磁除铁器、电磁搅拌器、电缆卷筒等工业电磁设备的设计、制造与销售。25年行业经验，服务全球500+企业客户。",
    images: [
      {
        url: "https://tsmainite.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "唐山迈尼特",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "唐山迈尼特 - 工业电磁设备领先制造商",
    description: "专业从事电磁除铁器、电磁搅拌器、电缆卷筒等工业电磁设备的设计、制造与销售。",
    images: ["https://tsmainite.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  alternates: {
    canonical: "https://tsmainite.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/images/favicon.png" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          {/* <PageViewTracker /> */}
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
