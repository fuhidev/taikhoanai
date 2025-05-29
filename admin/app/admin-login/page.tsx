"use client";

import { Lock, Phone, Visibility, VisibilityOff } from "@mui/icons-material";
import {
 Alert,
 Box,
 Button,
 Card,
 CardContent,
 Container,
 IconButton,
 InputAdornment,
 TextField,
 Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
 const [phoneNumber, setPhoneNumber] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
   const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber, password }),
   });

   const result = await response.json();

   if (result.success) {
    // Redirect to dashboard
    router.push("/");
   } else {
    setError(result.message || "Đăng nhập thất bại");
   }
  } catch {
   setError("Có lỗi xảy ra khi đăng nhập");
  } finally {
   setLoading(false);
  }
 };

 return (
  <Container maxWidth="sm">
   <Box
    sx={{
     minHeight: "100vh",
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
    }}
   >
    <Card sx={{ width: "100%", maxWidth: 400 }}>
     <CardContent sx={{ p: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
       <Typography variant="h4" component="h1" gutterBottom>
        Hệ thống quản lý
       </Typography>
       <Typography variant="body2" color="text.secondary">
        Đăng nhập để truy cập trang quản trị
       </Typography>
      </Box>

      {error && (
       <Alert severity="error" sx={{ mb: 3 }}>
        {error}
       </Alert>
      )}

      <form onSubmit={handleSubmit}>
       <TextField
        fullWidth
        label="Số điện thoại"
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        margin="normal"
        required
        InputProps={{
         startAdornment: (
          <InputAdornment position="start">
           <Phone />
          </InputAdornment>
         ),
        }}
       />

       <TextField
        fullWidth
        label="Mật khẩu"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        InputProps={{
         startAdornment: (
          <InputAdornment position="start">
           <Lock />
          </InputAdornment>
         ),
         endAdornment: (
          <InputAdornment position="end">
           <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
           >
            {showPassword ? <VisibilityOff /> : <Visibility />}
           </IconButton>
          </InputAdornment>
         ),
        }}
       />

       <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
       >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
       </Button>
      </form>
     </CardContent>
    </Card>
   </Box>
  </Container>
 );
}
