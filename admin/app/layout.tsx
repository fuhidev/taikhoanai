"use client";

import Navigation from "@/components/Navigation";
import CustomThemeProvider from "@/components/ThemeProvider";
import {
 AppBar,
 Box,
 Button,
 Container,
 Toolbar,
 Typography,
} from "@mui/material";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 const router = useRouter();
 const pathname = usePathname();
 const isLoginPage = pathname === "/login";

 const handleLogout = async () => {
  try {
   await fetch("/api/admin/logout", { method: "POST" });
   router.push("/login");
  } catch (error) {
   console.error("Logout error:", error);
  }
 };
 return (
  <html lang="vi">
   {" "}
   <head>
    <title>Tài khoản AI Giá rẻ - aigiare.vn</title>
    <meta name="description" content="Tài khoản AI Giá rẻ - aigiare.vn" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <meta
     name="robots"
     content="noindex, nofollow, noarchive, nosnippet, noimageindex"
    />
    <meta
     name="googlebot"
     content="noindex, nofollow, noarchive, nosnippet, noimageindex"
    />
    <meta
     name="bingbot"
     content="noindex, nofollow, noarchive, nosnippet, noimageindex"
    />

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://aigiare.vn/" />
    <meta property="twitter:title" content="Tài khoản AI Giá rẻ - aigiare.vn" />
    <meta
     property="twitter:description"
     content="Cung cấp các dịch vụ AI chất lượng cao với giá cả phải chăng. Hệ thống quản lý chuyên nghiệp."
    />

    {/* Favicon and icons */}
    <link rel="icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link
     rel="icon"
     type="image/png"
     sizes="192x192"
     href="/android-chrome-192x192.png"
    />
    <link
     rel="icon"
     type="image/png"
     sizes="512x512"
     href="/android-chrome-512x512.png"
    />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    {/* Structured Data */}
    <script type="application/ld+json">
     {JSON.stringify({
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
     })}
    </script>
   </head>
   <body className={inter.className}>
    <CustomThemeProvider>
     {!isLoginPage && (
      <AppBar position="static">
       <Toolbar>
        {" "}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Hệ thống quản lý aigiare.vn - Tài khoản AI Giá rẻ
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
         Đăng xuất
        </Button>
       </Toolbar>
      </AppBar>
     )}
     <Box sx={{ display: "flex", flexDirection: "column" }}>
      {!isLoginPage && (
       <Box component="nav">
        <Container maxWidth="xl" sx={{ mt: 4 }}>
         <Navigation />
        </Container>
       </Box>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: isLoginPage ? 0 : 3 }}>
       {isLoginPage ? (
        children
       ) : (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
         {children}
        </Container>
       )}
      </Box>
     </Box>
    </CustomThemeProvider>
   </body>
  </html>
 );
}
