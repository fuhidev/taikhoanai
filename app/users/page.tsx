"use client";

import { createUser, getAllUsers } from "@/lib/firebaseService";
import { User } from "@/types";
import { Add, Person } from "@mui/icons-material";
import {
 Alert,
 Box,
 Button,
 Chip,
 Dialog,
 DialogActions,
 DialogContent,
 DialogTitle,
 Paper,
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

interface CreateUserForm {
 phoneNumber: string;
 password: string;
}

export default function UsersPage() {
 const [users, setUsers] = useState<User[]>([]);
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
  formState: { errors },
 } = useForm<CreateUserForm>();

 const loadUsers = async () => {
  try {
   setLoading(true);
   const usersData = await getAllUsers();
   setUsers(usersData);
  } catch (error) {
   setAlert({ type: "error", message: "Có lỗi khi tải danh sách người dùng" });
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadUsers();
 }, []);

 const onSubmit = async (data: CreateUserForm) => {
  try {
   await createUser(data.phoneNumber, data.password);
   setAlert({ type: "success", message: "Tạo người dùng thành công" });
   setOpen(false);
   reset();
   loadUsers();
  } catch (error) {
   setAlert({ type: "error", message: "Có lỗi khi tạo người dùng" });
  }
 };

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
     Quản lý người dùng
    </Typography>
    <Button
     variant="contained"
     startIcon={<Add />}
     onClick={() => setOpen(true)}
    >
     Thêm người dùng
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
       <TableCell>Số điện thoại</TableCell>
       <TableCell>Ngày tạo</TableCell>
       <TableCell>Ngày cập nhật</TableCell>
       <TableCell>Trạng thái</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {loading ? (
       <TableRow>
        <TableCell colSpan={5} align="center">
         Đang tải...
        </TableCell>
       </TableRow>
      ) : users.length === 0 ? (
       <TableRow>
        <TableCell colSpan={5} align="center">
         Chưa có người dùng nào
        </TableCell>
       </TableRow>
      ) : (
       users.map((user) => (
        <TableRow key={user.id}>
         <TableCell>{user.id}</TableCell>
         <TableCell>{user.phoneNumber}</TableCell>
         <TableCell>{format(user.createdAt, "dd/MM/yyyy HH:mm")}</TableCell>
         <TableCell>{format(user.updatedAt, "dd/MM/yyyy HH:mm")}</TableCell>
         <TableCell>
          <Chip label="Hoạt động" color="success" size="small" />
         </TableCell>
        </TableRow>
       ))
      )}
     </TableBody>
    </Table>
   </TableContainer>

   {/* Dialog tạo người dùng */}
   <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
    <form onSubmit={handleSubmit(onSubmit)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <Person sx={{ mr: 1 }} />
       Thêm người dùng mới
      </Box>
     </DialogTitle>
     <DialogContent>
      <TextField
       {...register("phoneNumber", {
        required: "Số điện thoại là bắt buộc",
        pattern: {
         value: /^[0-9]{10,11}$/,
         message: "Số điện thoại không hợp lệ",
        },
       })}
       label="Số điện thoại"
       fullWidth
       margin="normal"
       error={!!errors.phoneNumber}
       helperText={errors.phoneNumber?.message}
      />
      <TextField
       {...register("password", {
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
       error={!!errors.password}
       helperText={errors.password?.message}
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
