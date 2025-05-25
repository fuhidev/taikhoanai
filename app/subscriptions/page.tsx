"use client";

import {
 createUserSubscription,
 getAllProducts,
 getAllUserSubscriptions,
 getAllUsers,
} from "@/lib/firebaseService";
import { Product, User, UserSubscription } from "@/types";
import { Add, Assignment } from "@mui/icons-material";
import {
 Alert,
 Box,
 Button,
 Chip,
 Dialog,
 DialogActions,
 DialogContent,
 DialogTitle,
 FormControl,
 InputLabel,
 MenuItem,
 Paper,
 Select,
 Table,
 TableBody,
 TableCell,
 TableContainer,
 TableHead,
 TableRow,
 TextField,
 Typography,
} from "@mui/material";
import { format, isAfter } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateSubscriptionForm {
 userId: string;
 productId: string;
 duration: number;
}

export default function SubscriptionsPage() {
 const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
 const [users, setUsers] = useState<User[]>([]);
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [open, setOpen] = useState(false);
 const [alert, setAlert] = useState<{
  type: "success" | "error";
  message: string;
 } | null>(null);

 const {
  register,
  handleSubmit,
  reset,
  watch,
  formState: { errors },
 } = useForm<CreateSubscriptionForm>();
 const watchedProductId = watch("productId");

 const loadData = async () => {
  try {
   setLoading(true);
   const [subscriptionsData, usersData, productsData] = await Promise.all([
    getAllUserSubscriptions(),
    getAllUsers(),
    getAllProducts(),
   ]);
   setSubscriptions(subscriptionsData);
   setUsers(usersData);
   setProducts(productsData);
  } catch (error) {
   setAlert({ type: "error", message: "Có lỗi khi tải dữ liệu" });
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadData();
 }, []);

 const onSubmit = async (data: CreateSubscriptionForm) => {
  try {
   await createUserSubscription(data.userId, data.productId, data.duration);
   setAlert({ type: "success", message: "Tạo subscription thành công" });
   setOpen(false);
   reset();
   loadData();
  } catch (error) {
   setAlert({ type: "error", message: "Có lỗi khi tạo subscription" });
  }
 };

 const getUserName = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  return user ? user.phoneNumber : "Unknown";
 };

 const getProductName = (productId: string) => {
  const product = products.find((p) => p.id === productId);
  return product ? product.name : "Unknown";
 };

 const isExpired = (endDate: Date) => !isAfter(endDate, new Date());

 const selectedProduct = products.find((p) => p.id === watchedProductId);

 return (
  <Box>
   <Box
    sx={{
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
     mb: 3,
    }}
   >
    <Typography variant="h4" component="h1">
     Quản lý Subscription
    </Typography>
    <Button
     variant="contained"
     startIcon={<Add />}
     onClick={() => setOpen(true)}
    >
     Thêm subscription
    </Button>
   </Box>

   {alert && (
    <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
     {alert.message}
    </Alert>
   )}

   <TableContainer component={Paper}>
    <Table>
     <TableHead>
      <TableRow>
       <TableCell>ID</TableCell>
       <TableCell>Khách hàng</TableCell>
       <TableCell>Sản phẩm</TableCell>
       <TableCell>Ngày bắt đầu</TableCell>
       <TableCell>Ngày kết thúc</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Ngày tạo</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {loading ? (
       <TableRow>
        <TableCell colSpan={7} align="center">
         Đang tải...
        </TableCell>
       </TableRow>
      ) : subscriptions.length === 0 ? (
       <TableRow>
        <TableCell colSpan={7} align="center">
         Chưa có subscription nào
        </TableCell>
       </TableRow>
      ) : (
       subscriptions.map((subscription) => {
        const expired = isExpired(subscription.endDate);
        const active = subscription.isActive && !expired;

        return (
         <TableRow key={subscription.id}>
          <TableCell>{subscription.id.slice(-8)}</TableCell>
          <TableCell>{getUserName(subscription.userId)}</TableCell>
          <TableCell>{getProductName(subscription.productId)}</TableCell>
          <TableCell>{format(subscription.startDate, "dd/MM/yyyy")}</TableCell>
          <TableCell>{format(subscription.endDate, "dd/MM/yyyy")}</TableCell>
          <TableCell>
           <Chip
            label={
             active ? "Hoạt động" : expired ? "Hết hạn" : "Không hoạt động"
            }
            color={active ? "success" : expired ? "error" : "default"}
            size="small"
           />
          </TableCell>
          <TableCell>
           {format(subscription.createdAt, "dd/MM/yyyy HH:mm")}
          </TableCell>
         </TableRow>
        );
       })
      )}
     </TableBody>
    </Table>
   </TableContainer>

   {/* Dialog tạo subscription */}
   <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
    <form onSubmit={handleSubmit(onSubmit)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <Assignment sx={{ mr: 1 }} />
       Tạo subscription mới
      </Box>
     </DialogTitle>
     <DialogContent>
      <FormControl fullWidth margin="normal">
       <InputLabel>Khách hàng</InputLabel>
       <Select
        {...register("userId", { required: "Vui lòng chọn khách hàng" })}
        label="Khách hàng"
        error={!!errors.userId}
       >
        {users.map((user) => (
         <MenuItem key={user.id} value={user.id}>
          {user.phoneNumber}
         </MenuItem>
        ))}
       </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
       <InputLabel>Sản phẩm</InputLabel>
       <Select
        {...register("productId", { required: "Vui lòng chọn sản phẩm" })}
        label="Sản phẩm"
        error={!!errors.productId}
       >
        {products.map((product) => (
         <MenuItem key={product.id} value={product.id}>
          {product.name} ({product.duration} ngày)
         </MenuItem>
        ))}
       </Select>
      </FormControl>

      <TextField
       {...register("duration", {
        required: "Thời hạn là bắt buộc",
        min: { value: 1, message: "Thời hạn phải lớn hơn 0" },
       })}
       label="Thời hạn sử dụng (ngày)"
       type="number"
       fullWidth
       margin="normal"
       error={!!errors.duration}
       helperText={
        errors.duration?.message ||
        (selectedProduct ? `Mặc định: ${selectedProduct.duration} ngày` : "")
       }
       defaultValue={selectedProduct?.duration || ""}
      />
     </DialogContent>
     <DialogActions>
      <Button onClick={() => setOpen(false)}>Hủy</Button>
      <Button type="submit" variant="contained">
       Tạo
      </Button>
     </DialogActions>
    </form>
   </Dialog>
  </Box>
 );
}
