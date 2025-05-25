"use client";

import {
 Assignment,
 Inventory,
 People,
 ShoppingCart,
} from "@mui/icons-material";
import {
 Box,
 Button,
 Card,
 CardActions,
 CardContent,
 Grid,
 Typography,
} from "@mui/material";
import Link from "next/link";

const DashboardCard = ({
 title,
 description,
 icon,
 href,
}: {
 title: string;
 description: string;
 icon: React.ReactNode;
 href: string;
}) => (
 <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
  <CardContent sx={{ flexGrow: 1 }}>
   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    {icon}
    <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
     {title}
    </Typography>
   </Box>
   <Typography variant="body2" color="text.secondary">
    {description}
   </Typography>
  </CardContent>
  <CardActions>
   <Link href={href} passHref>
    <Button size="small" variant="contained">
     Quản lý
    </Button>
   </Link>
  </CardActions>
 </Card>
);

export default function HomePage() {
 return (
  <Box>
   <Typography variant="h4" component="h1" gutterBottom>
    Dashboard - Hệ thống quản lý AI Access
   </Typography>

   <Typography variant="body1" paragraph>
    Chào mừng đến với hệ thống quản lý bán tài khoản truy cập nền tảng AI. Sử
    dụng các menu bên dưới để quản lý người dùng, sản phẩm, đơn hàng và
    subscription.
   </Typography>

   <Grid container spacing={3} sx={{ mt: 2 }}>
    <Grid item xs={12} sm={6} md={3}>
     <DashboardCard
      title="Người dùng"
      description="Quản lý danh sách người dùng, tạo tài khoản mới và cập nhật thông tin"
      icon={<People color="primary" />}
      href="/users"
     />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
     <DashboardCard
      title="Sản phẩm"
      description="Quản lý danh sách sản phẩm AI, cập nhật cookie và thông tin website"
      icon={<Inventory color="primary" />}
      href="/products"
     />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
     <DashboardCard
      title="Đơn hàng"
      description="Xem và quản lý các đơn hàng từ khách hàng"
      icon={<ShoppingCart color="primary" />}
      href="/orders"
     />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
     <DashboardCard
      title="Subscription"
      description="Quản lý gói sản phẩm mà người dùng đã mua"
      icon={<Assignment color="primary" />}
      href="/subscriptions"
     />
    </Grid>
   </Grid>
  </Box>
 );
}
