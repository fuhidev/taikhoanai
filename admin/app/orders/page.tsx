"use client";

import { IntegratedServerTable } from "@/components";
import type { IntegratedServerTableRef } from "@/components/IntegratedServerTable";
import {
 createOrder,
 createUser,
 createUserSubscription,
 deleteOrder,
 getAllProducts,
 getAllUsers,
 getPaginatedOrders,
 updateOrderStatus,
} from "@/lib/firebaseService";
import { Order, Product, User } from "@/types";
import { Add, Delete, PersonAdd, ShoppingCart } from "@mui/icons-material";
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
import { useEffect, useRef, useState } from "react";
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
 fullName: string;
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
 // Ref to access table methods
 const tableRef = useRef<IntegratedServerTableRef<Order>>(null);
 const [users, setUsers] = useState<User[]>([]);
 const [products, setProducts] = useState<Product[]>([]);
 const [open, setOpen] = useState(false);
 const [createUserOpen, setCreateUserOpen] = useState(false);

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
 const loadStaticData = async () => {
  try {
   const [usersData, productsData] = await Promise.all([
    getAllUsers(),
    getAllProducts(),
   ]);
   setUsers(usersData);
   setProducts(productsData);
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tải dữ liệu" });
  }
 };

 useEffect(() => {
  loadStaticData();
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
   tableRef.current?.refresh();
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tạo đơn hàng" });
  }
 };

 const onSubmitCreateUser = async (data: CreateUserForm) => {
  try {
   await createUser(data.phoneNumber, data.password, data.fullName);
   setAlert({ type: "success", message: "Tạo khách hàng thành công" });
   setCreateUserOpen(false);
   resetUser();
   loadStaticData(); // Reload static data để lấy user mới tạo
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tạo khách hàng" });
  }
 };
 const handleStatusChange = async (
  orderId: string,
  newStatus: Order["status"]
 ) => {
  // Không cho phép thay đổi trạng thái đơn hàng đã hoàn thành
  const currentData = tableRef.current?.getCurrentData() || [];
  const order = currentData.find((o: Order) => o.id === orderId);
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
   tableRef.current?.refresh();
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
    tableRef.current?.refresh();
   } catch {
    setAlert({ type: "error", message: "Có lỗi khi xóa đơn hàng" });
   }
  }
 };

 const getUserName = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  return user ? (
   <Box>
    <Typography variant="body2" fontWeight="medium">
     {user.phoneNumber}
    </Typography>
    <Typography variant="body2" color="text.secondary">
     {user.fullName}
    </Typography>
   </Box>
  ) : (
   "Unknown"
  );
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
     justifyContent: "flex-end",
     alignItems: "center",
     mb: 3,
    }}
   >
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
     {" "}
     {alert.message}
    </Alert>
   )}{" "}
   <IntegratedServerTable<Order>
    ref={tableRef}
    fetchFunction={getPaginatedOrders}
    initialLimit={15}
    orderByField="createdAt"
    orderDirection="desc"
    title="Quản lý đơn hàng"
    emptyMessage="Chưa có đơn hàng nào"
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
          {user.phoneNumber} ({user.fullName})
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

      <TextField
       {...registerUser("fullName", {
        required: "Tên đầy đủ là bắt buộc",
        minLength: {
         value: 2,
         message: "Tên phải có ít nhất 2 ký tự",
        },
       })}
       label="Tên đầy đủ"
       fullWidth
       margin="normal"
       error={!!userErrors.fullName}
       helperText={userErrors.fullName?.message}
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
