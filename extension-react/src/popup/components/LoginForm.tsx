import { Lock, Phone, Visibility, VisibilityOff } from "@mui/icons-material";
import {
 Alert,
 Box,
 Button,
 IconButton,
 InputAdornment,
 Paper,
 TextField,
 Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ApiService } from "../../shared/api";
import { StorageService } from "../../shared/storage";
import { StoredUserData } from "../../shared/types";

interface LoginFormProps {
 onLoginSuccess: (userData: StoredUserData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
 const [phoneNumber, setPhoneNumber] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!phoneNumber.trim() || !password.trim()) {
   setError("Vui lòng nhập đầy đủ thông tin");
   return;
  }

  setIsLoading(true);
  setError(null);

  try {
   console.log("Attempting login...");
   const response = await ApiService.login({
    phoneNumber: phoneNumber.trim(),
    password: password.trim(),
   });
   console.log("Login response:", response);

   if (response.success && response.user) {
    console.log("Login successful, getting product access...");

    // Create user data object
    const userData: StoredUserData = {
     user: response.user,
     subscriptions: response.subscriptions || [],
     productAccess: [],
     loginTime: Date.now(),
    };

    try {
     // Get product access
     const productAccessResponse = await ApiService.getProductAccess(
      response.user.id
     );
     console.log("Product access response:", productAccessResponse);

     if (productAccessResponse.success && productAccessResponse.data) {
      userData.productAccess = productAccessResponse.data;
     }
    } catch (productError) {
     console.warn("Failed to fetch product access:", productError);
     // Continue with empty product access
    }

    // Store user data
    await StorageService.setUserData(userData);
    console.log("User data stored:", userData);

    // Notify parent component
    onLoginSuccess(userData);
   } else {
    console.log("Login failed:", response.message);
    setError(response.message || "Đăng nhập thất bại");
   }
  } catch (error) {
   console.error("Login error:", error);
   setError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
  } finally {
   setIsLoading(false);
  }
 };

 const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !isLoading) {
   handleSubmit(e as any);
  }
 };

 return (
  <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
   <Box sx={{ textAlign: "center", mb: 3 }}>
    <Typography variant="h5" color="primary" fontWeight="bold">
     AI Access Manager
    </Typography>
    <Typography variant="body2" color="text.secondary">
     Đăng nhập để quản lý tài khoản AI
    </Typography>
   </Box>

   <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
    <form onSubmit={handleSubmit}>
     {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
       {error}
      </Alert>
     )}

     <TextField
      fullWidth
      label="Số điện thoại"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      onKeyPress={handleKeyPress}
      disabled={isLoading}
      sx={{ mb: 2 }}
      InputProps={{
       startAdornment: (
        <InputAdornment position="start">
         <Phone color="action" />
        </InputAdornment>
       ),
      }}
      placeholder="Nhập số điện thoại"
     />

     <TextField
      fullWidth
      label="Mật khẩu"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onKeyPress={handleKeyPress}
      disabled={isLoading}
      sx={{ mb: 3 }}
      InputProps={{
       startAdornment: (
        <InputAdornment position="start">
         <Lock color="action" />
        </InputAdornment>
       ),
       endAdornment: (
        <InputAdornment position="end">
         <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
         </IconButton>
        </InputAdornment>
       ),
      }}
      placeholder="Nhập mật khẩu"
     />

     <Button
      type="submit"
      fullWidth
      variant="contained"
      size="large"
      disabled={isLoading}
      sx={{ mb: 2 }}
     >
      {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
     </Button>
    </form>
   </Paper>
  </Box>
 );
};

export default LoginForm;
