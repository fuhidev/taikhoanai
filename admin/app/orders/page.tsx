"use client";

import PaginatedTable from "@/components/PaginatedTable";
import {
 createOrder,
 createUser,
 createUserSubscription,
 deleteOrder,
 getAllOrders,
 getAllProducts,
 getAllUsers,
 updateOrderStatus,
} from "@/lib/firebaseService";
import { Order, Product, User } from "@/types";
import {
 Add,
 Delete,
 FilterList,
 PersonAdd,
 ShoppingCart,
} from "@mui/icons-material";
import {
 Alert,
 Box,
 Button,
 Card,
 CardContent,
 Chip,
 Collapse,
 Dialog,
 DialogActions,
 DialogContent,
 DialogTitle,
 FormControl,
 Grid,
 IconButton,
 InputLabel,
 MenuItem,
 Select,
 TableCell,
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

interface CreateUserForm {
 phoneNumber: string;
 password: string;
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
 const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
 const [users, setUsers] = useState<User[]>([]);
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [open, setOpen] = useState(false);
 const [createUserOpen, setCreateUserOpen] = useState(false);
 const [showFilter, setShowFilter] = useState(false);

 // Filter states
 const [filterUserId, setFilterUserId] = useState("");
 const [filterProductId, setFilterProductId] = useState("");
 const [filterStatus, setFilterStatus] = useState<Order["status"] | "">("");
 const [filterStartDate, setFilterStartDate] = useState("");
 const [filterEndDate, setFilterEndDate] = useState("");

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
 const {
  register: registerUser,
  handleSubmit: handleSubmitUser,
  reset: resetUser,
  formState: { errors: userErrors },
 } = useForm<CreateUserForm>();

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
   setFilteredOrders(ordersData); // Khởi tạo danh sách đã lọc
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tải dữ liệu" });
  } finally {
   setLoading(false);
  }
 };
 // Logic lọc đơn hàng
 useEffect(() => {
  let filtered = [...orders];

  // Lọc theo khách hàng
  if (filterUserId) {
   filtered = filtered.filter((order) => order.userId === filterUserId);
  }

  // Lọc theo sản phẩm
  if (filterProductId) {
   filtered = filtered.filter((order) => order.productId === filterProductId);
  }

  // Lọc theo trạng thái
  if (filterStatus) {
   filtered = filtered.filter((order) => order.status === filterStatus);
  }

  // Lọc theo ngày bắt đầu
  if (filterStartDate) {
   const startDate = new Date(filterStartDate);
   filtered = filtered.filter((order) => order.createdAt >= startDate);
  }

  // Lọc theo ngày kết thúc
  if (filterEndDate) {
   const endDate = new Date(filterEndDate);
   endDate.setHours(23, 59, 59, 999); // Cuối ngày
   filtered = filtered.filter((order) => order.createdAt <= endDate);
  }

  setFilteredOrders(filtered);
 }, [
  orders,
  filterUserId,
  filterProductId,
  filterStatus,
  filterStartDate,
  filterEndDate,
 ]);

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
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tạo đơn hàng" });
  }
 };

 const onSubmitCreateUser = async (data: CreateUserForm) => {
  try {
   await createUser(data.phoneNumber, data.password);
   setAlert({ type: "success", message: "Tạo khách hàng thành công" });
   setCreateUserOpen(false);
   resetUser();
   loadData(); // Reload data để lấy user mới tạo
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tạo khách hàng" });
  }
 };
 const handleStatusChange = async (
  orderId: string,
  newStatus: Order["status"]
 ) => {
  // Không cho phép thay đổi trạng thái đơn hàng đã hoàn thành
  const order = orders.find((o) => o.id === orderId);
  if (order?.status === "completed") {
   setAlert({
    type: "error",
    message: "Không thể thay đổi trạng thái đơn hàng đã hoàn thành",
   });
   return;
  }

  try {
   await updateOrderStatus(orderId, newStatus);

   // Nếu đơn hàng được hoàn thành, tạo subscription cho user
   if (newStatus === "completed") {
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
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi cập nhật trạng thái" });
  }
 };
 const handleDeleteOrder = async (order: Order) => {
  // Không cho phép xóa đơn hàng đã hoàn thành
  if (order.status === "completed") {
   setAlert({
    type: "error",
    message: "Không thể xóa đơn hàng đã hoàn thành",
   });
   return;
  }

  if (
   window.confirm(
    `Bạn có chắc muốn xóa đơn hàng của "${getUserName(order.userId)}"?`
   )
  ) {
   try {
    await deleteOrder(order.id);
    setAlert({ type: "success", message: "Xóa đơn hàng thành công" });
    loadData();
   } catch {
    setAlert({ type: "error", message: "Có lỗi khi xóa đơn hàng" });
   }
  }
 };
 const clearFilters = () => {
  setFilterUserId("");
  setFilterProductId("");
  setFilterStatus("");
  setFilterStartDate("");
  setFilterEndDate("");
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
    <Box sx={{ display: "flex", gap: 2 }}>
     <Button
      variant="outlined"
      startIcon={<FilterList />}
      onClick={() => setShowFilter(!showFilter)}
     >
      Lọc đơn hàng
     </Button>
     <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => setOpen(true)}
     >
      Tạo đơn hàng
     </Button>
    </Box>
   </Box>
   {/* Bộ lọc */}
   <Collapse in={showFilter}>
    <Card sx={{ mb: 3 }}>
     <CardContent>
      <Typography variant="h6" gutterBottom>
       Bộ lọc đơn hàng
      </Typography>
      <Grid container spacing={2}>
       {" "}
       <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
         <InputLabel>Khách hàng</InputLabel>
         <Select
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          label="Khách hàng"
         >
          <MenuItem value="">Tất cả</MenuItem>
          {users.map((user) => (
           <MenuItem key={user.id} value={user.id}>
            {user.phoneNumber}
           </MenuItem>
          ))}
         </Select>
        </FormControl>
       </Grid>
       <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
         <InputLabel>Sản phẩm</InputLabel>
         <Select
          value={filterProductId}
          onChange={(e) => setFilterProductId(e.target.value)}
          label="Sản phẩm"
         >
          <MenuItem value="">Tất cả</MenuItem>
          {products.map((product) => (
           <MenuItem key={product.id} value={product.id}>
            {product.name}
           </MenuItem>
          ))}
         </Select>
        </FormControl>
       </Grid>
       <Grid item xs={12} md={2}>
        <FormControl fullWidth size="small">
         <InputLabel>Trạng thái</InputLabel>
         <Select
          value={filterStatus}
          onChange={(e) =>
           setFilterStatus(e.target.value as Order["status"] | "")
          }
          label="Trạng thái"
         >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="pending">Chờ xử lý</MenuItem>
          <MenuItem value="completed">Hoàn thành</MenuItem>
          <MenuItem value="cancelled">Đã hủy</MenuItem>
         </Select>
        </FormControl>
       </Grid>
       <Grid item xs={12} md={2}>
        <TextField
         value={filterStartDate}
         onChange={(e) => setFilterStartDate(e.target.value)}
         label="Từ ngày"
         type="date"
         size="small"
         fullWidth
         InputLabelProps={{
          shrink: true,
         }}
        />
       </Grid>
       <Grid item xs={12} md={2}>
        <TextField
         value={filterEndDate}
         onChange={(e) => setFilterEndDate(e.target.value)}
         label="Đến ngày"
         type="date"
         size="small"
         fullWidth
         InputLabelProps={{
          shrink: true,
         }}
        />
       </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
       <Button variant="outlined" size="small" onClick={clearFilters}>
        Xóa bộ lọc
       </Button>
       <Typography variant="body2" sx={{ alignSelf: "center", ml: 2 }}>
        Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
       </Typography>
      </Box>
     </CardContent>
    </Card>
   </Collapse>
   {alert && (
    <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
     {alert.message}
    </Alert>
   )}{" "}
   <PaginatedTable
    data={filteredOrders}
    loading={loading}
    itemsPerPage={15}
    emptyMessage={
     orders.length === 0
      ? "Chưa có đơn hàng nào"
      : "Không có đơn hàng nào phù hợp với bộ lọc"
    }
    renderHeader={() => (
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
    )}
    renderRow={(order) => (
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
       <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
         <Select
          value={order.status}
          onChange={(e) =>
           handleStatusChange(order.id, e.target.value as Order["status"])
          }
          disabled={order.status === "completed"}
         >
          <MenuItem value="pending">Chờ xử lý</MenuItem>
          <MenuItem value="completed">Hoàn thành</MenuItem>
          <MenuItem value="cancelled">Đã hủy</MenuItem>
         </Select>
        </FormControl>
        <IconButton
         onClick={() => handleDeleteOrder(order)}
         color="error"
         size="small"
         disabled={order.status === "completed"}
        >
         <Delete />
        </IconButton>
       </Box>
      </TableCell>
     </TableRow>
    )}
   />
   {/* Dialog tạo đơn hàng */}
   <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
    <form onSubmit={handleSubmit(onSubmit)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <ShoppingCart sx={{ mr: 1 }} />
       Tạo đơn hàng mới
      </Box>
     </DialogTitle>{" "}
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
       <Box sx={{ mt: 1 }}>
        <Button
         variant="outlined"
         size="small"
         startIcon={<PersonAdd />}
         onClick={() => setCreateUserOpen(true)}
        >
         Tạo khách hàng mới
        </Button>
       </Box>
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
      </Button>{" "}
     </DialogActions>
    </form>
   </Dialog>
   {/* Dialog tạo khách hàng mới */}
   <Dialog
    open={createUserOpen}
    onClose={() => setCreateUserOpen(false)}
    maxWidth="sm"
    fullWidth
   >
    <form onSubmit={handleSubmitUser(onSubmitCreateUser)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <PersonAdd sx={{ mr: 1 }} />
       Tạo khách hàng mới
      </Box>
     </DialogTitle>
     <DialogContent>
      <TextField
       {...registerUser("phoneNumber", {
        required: "Số điện thoại là bắt buộc",
        pattern: {
         value: /^[0-9]{10,11}$/,
         message: "Số điện thoại không hợp lệ",
        },
       })}
       label="Số điện thoại"
       fullWidth
       margin="normal"
       error={!!userErrors.phoneNumber}
       helperText={userErrors.phoneNumber?.message}
      />

      <TextField
       {...registerUser("password", {
        required: "Mật khẩu là bắt buộc",
        minLength: {
         value: 6,
         message: "Mật khẩu phải có ít nhất 6 ký tự",
        },
       })}
       label="Mật khẩu"
       type="password"
       fullWidth
       margin="normal"
       error={!!userErrors.password}
       helperText={userErrors.password?.message}
      />
     </DialogContent>
     <DialogActions>
      <Button onClick={() => setCreateUserOpen(false)}>Hủy</Button>
      <Button type="submit" variant="contained">
       Tạo khách hàng
      </Button>
     </DialogActions>
    </form>
   </Dialog>
  </Box>
 );
}
