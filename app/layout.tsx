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
   <body className={inter.className}>
    <CustomThemeProvider>
     {!isLoginPage && (
      <AppBar position="static">
       <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Hệ thống quản lý aigiare.vn
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
