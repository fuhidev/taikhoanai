"use client";

import {
 Assignment,
 Campaign,
 Description,
 Inventory,
 People,
 Security,
 ShoppingCart,
} from "@mui/icons-material";
import { Box, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
const navigationItems = [
 { label: "Người dùng", href: "/users", icon: <People /> },
 { label: "Sản phẩm", href: "/products", icon: <Inventory /> },
 { label: "Đơn hàng", href: "/orders", icon: <ShoppingCart /> },
 { label: "Subscription", href: "/subscriptions", icon: <Assignment /> },
 { label: "Pages", href: "/pages", icon: <Description /> },
 { label: "Sessions", href: "/sessions", icon: <Security /> },
 { label: "Quảng cáo", href: "/advertisements", icon: <Campaign /> },
];

const Navigation = () => {
 const pathname = usePathname();
 const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 const tabValue = useMemo(() => {
  return navigationItems.findIndex((item) => item.href.includes(pathname));
 }, [pathname]);

 return (
  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
   <Tabs
    value={tabValue}
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
