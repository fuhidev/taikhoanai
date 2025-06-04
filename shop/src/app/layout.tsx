import { Header } from "@/components/Header";
import { MouseTracker } from "@/components/animations/MouseTracker";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
 title: "Tài khoản AI Giá rẻ - aigiare.vn",
 description:
  "Cung cấp các dịch vụ AI chất lượng cao với giá cả phải chăng. Hệ thống quản lý chuyên nghiệp.",
 robots: {
  index: true,
  follow: true,
  noarchive: false,
  nosnippet: false,
  noimageindex: false,
  googleBot: {
   index: true,
   follow: true,
   noarchive: false,
   nosnippet: false,
   noimageindex: false,
  },
 },
 openGraph: {
  images: ["/meta-img.jpg"],
 },
 twitter: {
  card: "summary_large_image",
  site: "https://aigiare.vn/",
  title: "Tài khoản AI Giá rẻ - aigiare.vn",
  description:
   "Cung cấp các dịch vụ AI chất lượng cao với giá cả phải chăng. Hệ thống quản lý chuyên nghiệp.",
  images: ["/meta-img.jpg"],
 },
 icons: {
  icon: [
   { url: "/favicon.ico" },
   { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
   { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
   { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
   { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
  ],
  apple: "/apple-touch-icon.png",
 },
};

export const viewport = {
 width: "device-width",
 initialScale: 1,
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="vi">
   <head>
    <meta
     name="bingbot"
     content="noindex, nofollow, noarchive, nosnippet, noimageindex"
    />
    <script
     type="application/ld+json"
     dangerouslySetInnerHTML={{
      __html: JSON.stringify({
       "@context": "https://schema.org",
       "@type": "Organization",
       name: "aigiare.vn",
       url: "https://aigiare.vn",
       description: "Cung cấp tài khoản AI giá rẻ với chất lượng cao",
       sameAs: ["https://aigiare.vn"],
       contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: "Vietnamese",
       },
      }),
     }}
    />
   </head>
   <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <MouseTracker />
    <Header />
    <main>{children}</main>
    <footer className="bg-card border-t border-border">
     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center text-muted-foreground">
       <p>&copy; 2024 aigiare.vn. Tất cả quyền được bảo lưu.</p>
       <p className="mt-2 text-sm">
        Tài khoản AI chất lượng cao - Giá cả hợp lý - Hỗ trợ 24/7
       </p>
       <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/privacy" className="hover:text-primary transition-colors">
         Chính sách bảo mật
        </Link>
        <span className="text-muted-foreground/50">•</span>
        <Link href="/terms" className="hover:text-primary transition-colors">
         Điều khoản sử dụng
        </Link>
        <span className="text-muted-foreground/50">•</span>
        <Link
         href="/extension"
         className="hover:text-primary transition-colors"
        >
         Extension
        </Link>
        <span className="text-muted-foreground/50">•</span>
        <Link
         href="/extension-privacy"
         className="hover:text-primary transition-colors"
        >
         Chính sách Extension
        </Link>
        <Link
         href="/page/affiliate"
         className="hover:text-primary transition-colors"
        >
         Afiliate
        </Link>
        <span className="text-muted-foreground/50">•</span>
        <Link href="/contact" className="hover:text-primary transition-colors">
         Liên hệ
        </Link>
       </div>
      </div>
     </div>
    </footer>
   </body>
  </html>
 );
}
