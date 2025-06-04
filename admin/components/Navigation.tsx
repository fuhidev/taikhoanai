"use client";

import {
 Assignment,
 Description,
 Extension,
 Home,
 Inventory,
 People,
 Security,
 ShoppingCart,
} from "@mui/icons-material";
import { Box, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
 const pathname = usePathname();
 const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 const getTabValue = () => {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/users")) return 1;
  if (pathname.startsWith("/products")) return 2;
  if (pathname.startsWith("/orders")) return 3;
  if (pathname.startsWith("/subscriptions")) return 4;
  if (pathname.startsWith("/extension-versions")) return 5;
  if (pathname.startsWith("/pages")) return 6;
  if (pathname.startsWith("/sessions")) return 7;
  if (pathname.startsWith("/test-data")) return 8;
  return 0;
 };
 const navigationItems = [
  { label: "Dashboard", href: "/", icon: <Home /> },
  { label: "Người dùng", href: "/users", icon: <People /> },
  { label: "Sản phẩm", href: "/products", icon: <Inventory /> },
  { label: "Đơn hàng", href: "/orders", icon: <ShoppingCart /> },
  { label: "Subscription", href: "/subscriptions", icon: <Assignment /> },
  {
   label: "Extension Versions",
   href: "/extension-versions",
   icon: <Extension />,
  },
  { label: "Pages", href: "/pages", icon: <Description /> },
  { label: "Sessions", href: "/sessions", icon: <Security /> },
 ];

 return (
  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
   <Tabs
    value={getTabValue()}
    variant={isMobile ? "scrollable" : "standard"}
    scrollButtons={isMobile ? "auto" : false}
    sx={{
     "& .MuiTab-root": {
      minHeight: isMobile ? 48 : 64,
     },
    }}
   >
    {" "}
    {navigationItems.map((item) => (
     <Tab
      key={item.href}
      label={isMobile ? undefined : item.label}
      icon={item.icon}
      iconPosition={isMobile ? "top" : "start"}
      component={Link}
      href={item.href}
      sx={{
       "&.Mui-selected": {
        color: "primary.main",
       },
      }}
     />
    ))}
   </Tabs>
  </Box>
 );
};

export default Navigation;
