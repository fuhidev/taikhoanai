"use client";

import {
 Alert,
 Box,
 Button,
 Card,
 CardContent,
 Container,
 Divider,
 Grid,
 List,
 ListItem,
 ListItemText,
 Typography,
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import Navigation from "../../components/Navigation";
import { db } from "../../lib/firebase";

const TestDataPage = () => {
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState<{
  type: "success" | "error";
  text: string;
 } | null>(null);

 const sampleData = {
  users: [
   {
    id: "user1",
    phoneNumber: "0123456789",
    password: "123456",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    role: "user" as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
   },
   {
    id: "user2",
    phoneNumber: "0987654321",
    password: "123456",
    fullName: "Trần Thị B",
    email: "tranthib@email.com",
    role: "user" as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
   },
  ],

  products: [
   {
    id: "prod1",
    name: "ChatGPT Plus",
    description: "ChatGPT Plus access for 1 month",
    website: "https://chat.openai.com",
    price: 500000,
    duration: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
   },
   {
    id: "prod2",
    name: "Google Gemini Pro",
    description: "Google Gemini Pro access for 1 month",
    website: "https://gemini.google.com",
    price: 400000,
    duration: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
   },
   {
    id: "prod3",
    name: "Leonardo AI",
    description: "Leonardo AI Pro access for 1 month",
    website: "https://app.leonardo.ai",
    price: 300000,
    duration: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
   },
  ],

  productAccess: [
   {
    id: "access1",
    userId: "user1",
    productId: "prod1",
    productName: "ChatGPT Plus",
    website: "https://chat.openai.com",
    cookies: "session_id=abc123; auth_token=xyz789; user_pref=premium",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
   },
   {
    id: "access2",
    userId: "user1",
    productId: "prod2",
    productName: "Google Gemini Pro",
    website: "https://gemini.google.com",
    cookies: "gemini_session=def456; google_auth=uvw012; premium_access=true",
    startDate: new Date(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    isActive: true,
   },
   {
    id: "access3",
    userId: "user2",
    productId: "prod3",
    productName: "Leonardo AI",
    website: "https://app.leonardo.ai",
    cookies: "leonardo_token=ghi789; user_tier=pro; api_access=enabled",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isActive: true,
   },
  ],

  subscriptions: [
   {
    id: "sub1",
    userId: "user1",
    productId: "prod1",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "active" as const,
    autoRenew: true,
   },
   {
    id: "sub2",
    userId: "user1",
    productId: "prod2",
    startDate: new Date(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: "active" as const,
    autoRenew: false,
   },
   {
    id: "sub3",
    userId: "user2",
    productId: "prod3",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: "active" as const,
    autoRenew: true,
   },
  ],

  orders: [
   {
    id: "order1",
    userId: "user1",
    productId: "prod1",
    productName: "ChatGPT Plus",
    quantity: 1,
    price: 500000,
    totalAmount: 500000,
    status: "completed" as const,
    paymentMethod: "bank_transfer" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
   },
   {
    id: "order2",
    userId: "user1",
    productId: "prod2",
    productName: "Google Gemini Pro",
    quantity: 1,
    price: 400000,
    totalAmount: 400000,
    status: "completed" as const,
    paymentMethod: "momo" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
   },
   {
    id: "order3",
    userId: "user2",
    productId: "prod3",
    productName: "Leonardo AI",
    quantity: 1,
    price: 300000,
    totalAmount: 300000,
    status: "completed" as const,
    paymentMethod: "bank_transfer" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
   },
  ],
 };

 const addSampleData = async () => {
  setLoading(true);
  setMessage(null);

  try {
   // Add users
   for (const user of sampleData.users) {
    await setDoc(doc(db, "users", user.id), user);
   }

   // Add products
   for (const product of sampleData.products) {
    await setDoc(doc(db, "products", product.id), product);
   }

   // Add product access
   for (const access of sampleData.productAccess) {
    await setDoc(doc(db, "productAccess", access.id), access);
   }

   // Add subscriptions
   for (const subscription of sampleData.subscriptions) {
    await setDoc(doc(db, "subscriptions", subscription.id), subscription);
   }

   // Add orders
   for (const order of sampleData.orders) {
    await setDoc(doc(db, "orders", order.id), order);
   }

   setMessage({ type: "success", text: "✅ Đã thêm dữ liệu mẫu thành công!" });
  } catch (error) {
   console.error("Error adding sample data:", error);
   setMessage({ type: "error", text: "❌ Có lỗi xảy ra khi thêm dữ liệu mẫu" });
  } finally {
   setLoading(false);
  }
 };

 return (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
   <Navigation />

   <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
    <Typography variant="h4" component="h1" gutterBottom>
     🧪 Thêm Dữ Liệu Test
    </Typography>

    {message && (
     <Alert severity={message.type} sx={{ mb: 3 }}>
      {message.text}
     </Alert>
    )}

    <Grid container spacing={3}>
     <Grid item xs={12} md={6}>
      <Card>
       <CardContent>
        <Typography variant="h6" gutterBottom>
         📋 Dữ Liệu Sẽ Được Thêm
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>
         👥 Users (2):
        </Typography>
        <List dense>
         {sampleData.users.map((user) => (
          <ListItem key={user.id}>
           <ListItemText
            primary={user.fullName}
            secondary={`${user.phoneNumber} / ${user.password}`}
           />
          </ListItem>
         ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
         🛍️ Products (3):
        </Typography>
        <List dense>
         {sampleData.products.map((product) => (
          <ListItem key={product.id}>
           <ListItemText primary={product.name} secondary={product.website} />
          </ListItem>
         ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
         🔐 Product Access (3)
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
         📊 Subscriptions (3)
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
         🛒 Orders (3)
        </Typography>
       </CardContent>
      </Card>
     </Grid>

     <Grid item xs={12} md={6}>
      <Card>
       <CardContent>
        <Typography variant="h6" gutterBottom>
         🚀 Thực Hiện
        </Typography>

        <Button
         variant="contained"
         color="primary"
         size="large"
         fullWidth
         onClick={addSampleData}
         disabled={loading}
         sx={{ mb: 3 }}
        >
         {loading ? "⏳ Đang thêm dữ liệu..." : "📝 Thêm Dữ Liệu Mẫu"}
        </Button>

        <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
         <CardContent>
          <Typography variant="h6" gutterBottom>
           🧪 Tài Khoản Test
          </Typography>
          <Typography variant="body2" component="div">
           <strong>User 1:</strong>
           <br />
           📱 SĐT: 0123456789
           <br />
           🔑 MK: 123456
           <br />
           📋 Có 2 sản phẩm: ChatGPT Plus + Gemini Pro
           <br />
           <br />
           <strong>User 2:</strong>
           <br />
           📱 SĐT: 0987654321
           <br />
           🔑 MK: 123456
           <br />
           📋 Có 1 sản phẩm: Leonardo AI
          </Typography>
         </CardContent>
        </Card>
       </CardContent>
      </Card>
     </Grid>
    </Grid>
   </Container>
  </Box>
 );
};

export default TestDataPage;
