import {
 AccountCircle,
 CheckCircle,
 Error,
 ExitToApp,
 Schedule,
 Web,
} from "@mui/icons-material";
import {
 Avatar,
 Box,
 Button,
 Chip,
 Divider,
 List,
 ListItem,
 ListItemAvatar,
 ListItemText,
 Paper,
 Typography,
} from "@mui/material";
import React from "react";
import { ProductAccess, StoredUserData } from "../../shared/types";

interface DashboardProps {
 userData: StoredUserData;
 onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onLogout }) => {
 const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
   year: "numeric",
   month: "2-digit",
   day: "2-digit",
  });
 };

 const isProductExpired = (product: ProductAccess) => {
  return new Date(product.endDate) < new Date();
 };

 const getProductStatusColor = (product: ProductAccess) => {
  return isProductExpired(product) ? "error" : "success";
 };

 const getProductStatusText = (product: ProductAccess) => {
  return isProductExpired(product) ? "Hết hạn" : "Còn hạn";
 };

 return (
  <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
   {/* Header */}
   <Box
    sx={{
     display: "flex",
     alignItems: "center",
     justifyContent: "space-between",
     mb: 2,
    }}
   >
    <Typography variant="h6" color="primary" fontWeight="bold">
     Dashboard
    </Typography>
    <Button
     variant="outlined"
     color="error"
     size="small"
     startIcon={<ExitToApp />}
     onClick={onLogout}
    >
     Đăng xuất
    </Button>
   </Box>

   {/* User Info */}
   <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
     <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
      <AccountCircle />
     </Avatar>
     <Box>
      <Typography variant="subtitle1" fontWeight="bold">
       {userData.user.fullName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
       {userData.user.phoneNumber}
      </Typography>
     </Box>
    </Box>
    <Typography variant="caption" color="text.secondary">
     Đăng nhập: {new Date(userData.loginTime).toLocaleString("vi-VN")}
    </Typography>
   </Paper>

   {/* Products */}
   <Paper
    elevation={2}
    sx={{
     flex: 1,
     overflow: "hidden",
     display: "flex",
     flexDirection: "column",
    }}
   >
    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
     <Typography variant="h6" fontWeight="bold">
      Sản phẩm của bạn ({userData.productAccess.length})
     </Typography>
    </Box>

    <Box sx={{ flex: 1, overflow: "auto" }}>
     {userData.productAccess.length === 0 ? (
      <Box sx={{ p: 3, textAlign: "center" }}>
       <Typography variant="body2" color="text.secondary">
        Bạn chưa có sản phẩm nào
       </Typography>
      </Box>
     ) : (
      <List sx={{ p: 0 }}>
       {userData.productAccess.map((product, index) => (
        <React.Fragment key={product.id}>
         <ListItem sx={{ py: 2 }}>
          <ListItemAvatar>
           <Avatar sx={{ bgcolor: "primary.light" }}>
            <Web />
           </Avatar>
          </ListItemAvatar>
          <ListItemText
           primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
             <Typography variant="subtitle2" fontWeight="bold">
              {product.productName}
             </Typography>
             <Chip
              size="small"
              label={getProductStatusText(product)}
              color={getProductStatusColor(product)}
              icon={isProductExpired(product) ? <Error /> : <CheckCircle />}
             />
            </Box>
           }
           secondary={
            <Box sx={{ mt: 1 }}>
             <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
             >
              <Web fontSize="small" />
              {product.website}
             </Typography>
             <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
             >
              <Schedule fontSize="small" />
              Hết hạn: {formatDate(product.endDate)}
             </Typography>
            </Box>
           }
          />
         </ListItem>
         {index < userData.productAccess.length - 1 && <Divider />}
        </React.Fragment>
       ))}
      </List>
     )}
    </Box>
   </Paper>
  </Box>
 );
};

export default Dashboard;
