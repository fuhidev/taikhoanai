"use client";

import SearchableTable from "@/components/SearchableTable";
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
 TableCell,
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
 const [statusFilter, setStatusFilter] = useState<string>("all");
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

 // Filter subscriptions theo trạng thái
 const getFilteredSubscriptions = () => {
  if (statusFilter === "all") return subscriptions;

  return subscriptions.filter((subscription) => {
   const expired = isExpired(subscription.endDate);
   const active = subscription.isActive && !expired;

   switch (statusFilter) {
    case "active":
     return active;
    case "expired":
     return expired;
    case "inactive":
     return !subscription.isActive && !expired;
    default:
     return true;
   }
  });
 };

 // Thống kê subscriptions
 const getStats = () => {
  const total = subscriptions.length;
  const active = subscriptions.filter((sub) => {
   const expired = isExpired(sub.endDate);
   return sub.isActive && !expired;
  }).length;
  const expired = subscriptions.filter((sub) => isExpired(sub.endDate)).length;
  const inactive = subscriptions.filter(
   (sub) => !sub.isActive && !isExpired(sub.endDate)
  ).length;

  return { total, active, expired, inactive };
 };

 const stats = getStats();

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
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
     <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel>Lọc theo trạng thái</InputLabel>
      <Select
       value={statusFilter}
       onChange={(e) => setStatusFilter(e.target.value)}
       label="Lọc theo trạng thái"
      >
       <MenuItem value="all">Tất cả</MenuItem>
       <MenuItem value="active">Hoạt động</MenuItem>
       <MenuItem value="expired">Hết hạn</MenuItem>
       <MenuItem value="inactive">Không hoạt động</MenuItem>
      </Select>
     </FormControl>
     <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => setOpen(true)}
     >
      Thêm Subscription
     </Button>
    </Box>
   </Box>

   {alert && (
    <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
     {alert.message}
    </Alert>
   )}

   {/* Thống kê nhanh */}
   <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
    <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
     <Typography variant="h4" color="primary">
      {stats.total}
     </Typography>
     <Typography variant="body2" color="text.secondary">
      Tổng cộng
     </Typography>
    </Paper>
    <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
     <Typography variant="h4" color="success.main">
      {stats.active}
     </Typography>
     <Typography variant="body2" color="text.secondary">
      Hoạt động
     </Typography>
    </Paper>
    <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
     <Typography variant="h4" color="error.main">
      {stats.expired}
     </Typography>
     <Typography variant="body2" color="text.secondary">
      Hết hạn
     </Typography>
    </Paper>
    <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
     <Typography variant="h4" color="warning.main">
      {stats.inactive}
     </Typography>
     <Typography variant="body2" color="text.secondary">
      Không hoạt động
     </Typography>
    </Paper>
   </Box>

   <SearchableTable
    data={getFilteredSubscriptions().map((subscription) => ({
     ...subscription,
     userName: getUserName(subscription.userId),
     productName: getProductName(subscription.productId),
    }))}
    searchFields={["userName", "productName"]}
    loading={loading}
    itemsPerPage={12}
    searchPlaceholder="Tìm kiếm theo khách hàng hoặc sản phẩm..."
    emptyMessage={
     statusFilter === "all"
      ? "Chưa có subscription nào"
      : `Không có subscription nào ở trạng thái "${
         statusFilter === "active"
          ? "hoạt động"
          : statusFilter === "expired"
          ? "hết hạn"
          : "không hoạt động"
        }"`
    }
    renderHeader={() => (
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
    )}
    renderRow={(subscription) => {
     const expired = isExpired(subscription.endDate);
     const active = subscription.isActive && !expired;

     return (
      <TableRow key={subscription.id}>
       <TableCell>{subscription.id.slice(-8)}</TableCell>
       <TableCell>{subscription.userName}</TableCell>
       <TableCell>{subscription.productName}</TableCell>
       <TableCell>{format(subscription.startDate, "dd/MM/yyyy")}</TableCell>
       <TableCell>{format(subscription.endDate, "dd/MM/yyyy")}</TableCell>
       <TableCell>
        <Chip
         label={active ? "Hoạt động" : expired ? "Hết hạn" : "Không hoạt động"}
         color={active ? "success" : expired ? "error" : "default"}
         size="small"
        />
       </TableCell>
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
    }}
   />

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
