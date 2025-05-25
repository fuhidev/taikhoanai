"use client";

import {
 Assignment,
 Home,
 Inventory,
 People,
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
  return 0;
 };

 const navigationItems = [
  { label: "Dashboard", href: "/", icon: <Home /> },
  { label: "Người dùng", href: "/users", icon: <People /> },
  { label: "Sản phẩm", href: "/products", icon: <Inventory /> },
  { label: "Đơn hàng", href: "/orders", icon: <ShoppingCart /> },
  { label: "Subscription", href: "/subscriptions", icon: <Assignment /> },
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
    {navigationItems.map((item, index) => (
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
