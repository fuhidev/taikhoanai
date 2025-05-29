"use client";

import {
 createUserSubscription,
 getAllProducts,
 getAllUserSubscriptions,
 getAllUsers,
 revokeUserSubscription,
} from "@/lib/firebaseService";
import { Product, User, UserSubscription } from "@/types";
import { Add, Assignment, Block } from "@mui/icons-material";
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
 const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
 const [selectedSubscription, setSelectedSubscription] =
  useState<UserSubscription | null>(null);
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
  } catch {
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
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tạo subscription" });
  }
 };

 const handleRevokeSubscription = async () => {
  if (!selectedSubscription) return;

  try {
   await revokeUserSubscription(selectedSubscription.id);
   setAlert({ type: "success", message: "Thu hồi subscription thành công" });
   setRevokeDialogOpen(false);
   setSelectedSubscription(null);
   loadData();
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi thu hồi subscription" });
  }
 };

 const openRevokeDialog = (subscription: UserSubscription) => {
  setSelectedSubscription(subscription);
  setRevokeDialogOpen(true);
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
     {" "}
     <TableHead>
      <TableRow>
       <TableCell>ID</TableCell>
       <TableCell>Khách hàng</TableCell>
       <TableCell>Sản phẩm</TableCell>
       <TableCell>Ngày bắt đầu</TableCell>
       <TableCell>Ngày kết thúc</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Ngày tạo</TableCell>
       <TableCell>Thao tác</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {" "}
      {loading ? (
       <TableRow>
        <TableCell colSpan={8} align="center">
         Đang tải...
        </TableCell>
       </TableRow>
      ) : subscriptions.length === 0 ? (
       <TableRow>
        <TableCell colSpan={8} align="center">
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
          </TableCell>{" "}
          <TableCell>
           {format(subscription.createdAt, "dd/MM/yyyy HH:mm")}
          </TableCell>
          <TableCell>
           {active && (
            <Button
             variant="outlined"
             color="error"
             size="small"
             startIcon={<Block />}
             onClick={() => openRevokeDialog(subscription)}
            >
             Thu hồi
            </Button>
           )}
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
      </Button>{" "}
     </DialogActions>
    </form>
   </Dialog>

   {/* Dialog xác nhận thu hồi subscription */}
   <Dialog
    open={revokeDialogOpen}
    onClose={() => setRevokeDialogOpen(false)}
    maxWidth="sm"
    fullWidth
   >
    <DialogTitle>
     <Box sx={{ display: "flex", alignItems: "center" }}>
      <Block sx={{ mr: 1, color: "error.main" }} />
      Xác nhận thu hồi subscription
     </Box>
    </DialogTitle>
    <DialogContent>
     <Typography>
      Bạn có chắc chắn muốn thu hồi subscription này không?
     </Typography>
     {selectedSubscription && (
      <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
       <Typography variant="body2">
        <strong>Khách hàng:</strong> {getUserName(selectedSubscription.userId)}
       </Typography>
       <Typography variant="body2">
        <strong>Sản phẩm:</strong>{" "}
        {getProductName(selectedSubscription.productId)}
       </Typography>
       <Typography variant="body2">
        <strong>Ngày kết thúc:</strong>{" "}
        {format(selectedSubscription.endDate, "dd/MM/yyyy")}
       </Typography>
      </Box>
     )}
     <Typography variant="body2" color="error" sx={{ mt: 2 }}>
      <strong>Lưu ý:</strong> Hành động này sẽ vô hiệu hóa quyền truy cập của
      người dùng ngay lập tức và không thể hoàn tác.
     </Typography>
    </DialogContent>
    <DialogActions>
     <Button onClick={() => setRevokeDialogOpen(false)}>Hủy</Button>
     <Button
      onClick={handleRevokeSubscription}
      variant="contained"
      color="error"
     >
      Thu hồi
     </Button>
    </DialogActions>
   </Dialog>
  </Box>
 );
}
