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

// 动态获取网站元数据
async function getSiteMetadata() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/settings/meta`, {
      next: { revalidate: 3600 } // 缓存1小时
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Failed to fetch site metadata:', error);
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await getSiteMetadata();
  
  const title = siteMeta?.title || "唐山迈尼特 - 工业电磁设备领先制造商";
  const description = siteMeta?.description || "专业从事电磁除铁器、电磁搅拌器、电缆卷筒等工业电磁设备的设计、制造与销售。25年行业经验，服务全球500+企业客户。";
  const keywords = siteMeta?.keywords ? siteMeta.keywords.split(',').map((k: string) => k.trim()) : ["电磁除铁器", "电磁搅拌器", "工业电磁设备", "电缆卷筒", "液态金属泵"];
  const author = siteMeta?.author || "唐山迈尼特";
  const ogImage = siteMeta?.ogImage || "https://tsmainite.com/og-image.jpg";

  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
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
      siteName: author,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: author,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
}

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
