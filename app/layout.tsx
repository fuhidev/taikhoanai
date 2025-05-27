import Navigation from "@/components/Navigation";
import CustomThemeProvider from "@/components/ThemeProvider";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: "AI Access Management",
 description: "Hệ thống quản lý bán tài khoản truy cập nền tảng AI",
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <html lang="vi">
   <body className={inter.className}>
    {" "}
    <CustomThemeProvider>
     <AppBar position="static">
      <Toolbar>
       <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        aigiare.vn
       </Typography>
      </Toolbar>
     </AppBar>
     <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Navigation />
      <Box sx={{ mt: 4 }}>{children}</Box>
     </Container>
    </CustomThemeProvider>
   </body>
  </html>
 );
}
