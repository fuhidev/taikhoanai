"use client";

import {
 createOrder,
 createUserSubscription,
 getAllOrders,
 getAllProducts,
 getAllUsers,
 updateOrderStatus,
} from "@/lib/firebaseService";
import { Order, Product, User } from "@/types";
import { Add, ShoppingCart } from "@mui/icons-material";
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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateOrderForm {
 userId: string;
 productId: string;
 duration: number;
 totalAmount?: number;
}

const statusColors = {
 pending: "warning",
 completed: "success",
 cancelled: "error",
} as const;

const statusLabels = {
 pending: "Chờ xử lý",
 completed: "Hoàn thành",
 cancelled: "Đã hủy",
};

export default function OrdersPage() {
 const [orders, setOrders] = useState<Order[]>([]);
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
 } = useForm<CreateOrderForm>();
 const watchedProductId = watch("productId");

 const loadData = async () => {
  try {
   setLoading(true);
   const [ordersData, usersData, productsData] = await Promise.all([
    getAllOrders(),
    getAllUsers(),
    getAllProducts(),
   ]);
   setOrders(ordersData);
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

 const onSubmit = async (data: CreateOrderForm) => {
  try {
   await createOrder(
    data.userId,
    data.productId,
    data.duration,
    data.totalAmount
   );
   setAlert({ type: "success", message: "Tạo đơn hàng thành công" });
   setOpen(false);
   reset();
   loadData();
  } catch (error) {
   setAlert({ type: "error", message: "Có lỗi khi tạo đơn hàng" });
  }
 };

 const handleStatusChange = async (
  orderId: string,
  newStatus: Order["status"]
 ) => {
  try {
   await updateOrderStatus(orderId, newStatus);

   // Nếu đơn hàng được hoàn thành, tạo subscription cho user
   if (newStatus === "completed") {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
     await createUserSubscription(
      order.userId,
      order.productId,
      order.duration
     );
    }
   }

   setAlert({ type: "success", message: "Cập nhật trạng thái thành công" });
   loadData();
  } catch (error) {
   setAlert({ type: "error", message: "Có lỗi khi cập nhật trạng thái" });
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
     Quản lý đơn hàng
    </Typography>
    <Button
     variant="contained"
     startIcon={<Add />}
     onClick={() => setOpen(true)}
    >
     Tạo đơn hàng
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
       <TableCell>Thời hạn</TableCell>
       <TableCell>Tổng tiền</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Ngày tạo</TableCell>
       <TableCell>Thao tác</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {loading ? (
       <TableRow>
        <TableCell colSpan={8} align="center">
         Đang tải...
        </TableCell>
       </TableRow>
      ) : orders.length === 0 ? (
       <TableRow>
        <TableCell colSpan={8} align="center">
         Chưa có đơn hàng nào
        </TableCell>
       </TableRow>
      ) : (
       orders.map((order) => (
        <TableRow key={order.id}>
         <TableCell>{order.id.slice(-8)}</TableCell>
         <TableCell>{getUserName(order.userId)}</TableCell>
         <TableCell>{getProductName(order.productId)}</TableCell>
         <TableCell>{order.duration} ngày</TableCell>
         <TableCell>
          {order.totalAmount ? `${order.totalAmount.toLocaleString()}đ` : "-"}
         </TableCell>
         <TableCell>
          <Chip
           label={statusLabels[order.status]}
           color={statusColors[order.status]}
           size="small"
          />
         </TableCell>
         <TableCell>{format(order.createdAt, "dd/MM/yyyy HH:mm")}</TableCell>
         <TableCell>
          <FormControl size="small" sx={{ minWidth: 120 }}>
           <Select
            value={order.status}
            onChange={(e) =>
             handleStatusChange(order.id, e.target.value as Order["status"])
            }
           >
            <MenuItem value="pending">Chờ xử lý</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
            <MenuItem value="cancelled">Đã hủy</MenuItem>
           </Select>
          </FormControl>
         </TableCell>
        </TableRow>
       ))
      )}
     </TableBody>
    </Table>
   </TableContainer>

   {/* Dialog tạo đơn hàng */}
   <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
    <form onSubmit={handleSubmit(onSubmit)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <ShoppingCart sx={{ mr: 1 }} />
       Tạo đơn hàng mới
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

      <TextField
       {...register("totalAmount", {
        min: { value: 0, message: "Số tiền phải lớn hơn hoặc bằng 0" },
       })}
       label="Tổng tiền (VNĐ)"
       type="number"
       fullWidth
       margin="normal"
       error={!!errors.totalAmount}
       helperText={errors.totalAmount?.message}
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
