"use client";

import { IntegratedServerTable } from "@/components";
import type { IntegratedServerTableRef } from "@/components/IntegratedServerTable";
import {
 createUser,
 getPaginatedUsers,
 updateUserAdmin,
} from "@/lib/firebaseService";
import { User } from "@/types";
import { Add, Delete, Edit, Person } from "@mui/icons-material";
import {
 Alert,
 Box,
 Button,
 Chip,
 Dialog,
 DialogActions,
 DialogContent,
 DialogTitle,
 FormControlLabel,
 IconButton,
 Switch,
 TableCell,
 TableHead,
 TableRow,
 TextField,
} from "@mui/material";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateUserForm {
 phoneNumber: string;
 password: string;
 fullName: string;
 isAdmin?: boolean;
}

interface EditUserForm {
 phoneNumber: string;
 fullName?: string;
 isAdmin?: boolean;
}

export default function UsersPage() {
 // Ref to access table methods
 const tableRef = useRef<IntegratedServerTableRef<User>>(null);

 const [open, setOpen] = useState(false);
 const [editOpen, setEditOpen] = useState(false);
 const [editingUser, setEditingUser] = useState<User | null>(null);
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
 const {
  register: registerEdit,
  handleSubmit: handleSubmitEdit,
  reset: resetEdit,
  setValue: setValueEdit,
  formState: { errors: errorsEdit },
 } = useForm<EditUserForm>();

 const onSubmit = async (data: CreateUserForm) => {
  try {
   const userId = await createUser(
    data.phoneNumber,
    data.password,
    data.fullName
   );

   // Nếu có set isAdmin, cập nhật thêm
   if (data.isAdmin) {
    await updateUserAdmin(userId, true);
   }
   setAlert({ type: "success", message: "Tạo người dùng thành công" });
   setOpen(false);
   reset();
   tableRef.current?.refresh(); // Refresh server pagination
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tạo người dùng" });
  }
 };
 const onEditSubmit = async (data: EditUserForm) => {
  if (!editingUser) return;

  try {
   // Cập nhật thông tin người dùng
   const response = await fetch(`/api/admin/users/${editingUser.id}`, {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     phoneNumber: data.phoneNumber,
     fullName: data.fullName,
     isAdmin: data.isAdmin,
    }),
   });

   if (!response.ok) {
    throw new Error("Failed to update user");
   }

   setAlert({ type: "success", message: "Cập nhật người dùng thành công" });
   setEditOpen(false);
   resetEdit();
   setEditingUser(null);
   tableRef.current?.refresh();
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi cập nhật người dùng" });
  }
 };

 const handleEditUser = (user: User) => {
  setEditingUser(user);
  setValueEdit("phoneNumber", user.phoneNumber);
  setValueEdit("fullName", user.fullName || "");
  setValueEdit("isAdmin", user.isAdmin || false);
  setEditOpen(true);
 };

 const handleDeleteUser = async (userId: string) => {
  if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

  try {
   const response = await fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
   });

   if (!response.ok) {
    throw new Error("Failed to delete user");
   }

   setAlert({ type: "success", message: "Xóa người dùng thành công" });
   tableRef.current?.refresh();
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi xóa người dùng" });
  }
 };

 const handleToggleAdmin = async (
  userId: string,
  currentAdminStatus: boolean
 ) => {
  try {
   await updateUserAdmin(userId, !currentAdminStatus);
   setAlert({
    type: "success",
    message: `Đã ${!currentAdminStatus ? "cấp" : "thu hồi"} quyền admin`,
   });
   tableRef.current?.refresh();
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi cập nhật quyền admin" });
  }
 };
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
     Thêm người dùng
    </Button>
   </Box>
   {alert && (
    <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
     {alert.message}
    </Alert>
   )}{" "}
   <IntegratedServerTable<User>
    ref={tableRef}
    fetchFunction={getPaginatedUsers}
    initialLimit={10}
    orderByField="createdAt"
    orderDirection="desc"
    title="Quản lý người dùng"
    emptyMessage="Chưa có người dùng nào"
    renderHeader={() => (
     <TableHead>
      <TableRow>
       <TableCell>ID</TableCell>
       <TableCell>Số điện thoại</TableCell>
       <TableCell>Tên đầy đủ</TableCell>
       <TableCell>Ngày tạo</TableCell>
       <TableCell>Ngày cập nhật</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Quyền Admin</TableCell>
       <TableCell>Thao tác</TableCell>
      </TableRow>
     </TableHead>
    )}
    renderRow={(user: User) => (
     <TableRow key={user.id}>
      <TableCell>{user.id.slice(-8)}</TableCell>
      <TableCell>{user.phoneNumber}</TableCell>
      <TableCell>{user.fullName}</TableCell>
      <TableCell>{format(user.createdAt, "dd/MM/yyyy HH:mm")}</TableCell>
      <TableCell>{format(user.updatedAt, "dd/MM/yyyy HH:mm")}</TableCell>
      <TableCell>
       <Chip label="Hoạt động" color="success" size="small" />
      </TableCell>
      <TableCell>
       <FormControlLabel
        control={
         <Switch
          checked={user.isAdmin || false}
          onChange={() => handleToggleAdmin(user.id, user.isAdmin || false)}
          color="primary"
         />
        }
        label={user.isAdmin ? "Admin" : "User"}
       />
      </TableCell>
      <TableCell>
       <IconButton
        onClick={() => handleEditUser(user)}
        color="primary"
        size="small"
       >
        <Edit />
       </IconButton>
       <IconButton
        onClick={() => handleDeleteUser(user.id)}
        color="error"
        size="small"
       >
        <Delete />
       </IconButton>
      </TableCell>
     </TableRow>
    )}
   />
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
      {" "}
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
       {...register("fullName", {
        required: "Tên đầy đủ là bắt buộc",
        minLength: {
         value: 2,
         message: "Tên phải có ít nhất 2 ký tự",
        },
       })}
       label="Tên đầy đủ"
       fullWidth
       margin="normal"
       error={!!errors.fullName}
       helperText={errors.fullName?.message}
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
      <FormControlLabel
       control={<Switch {...register("isAdmin")} color="primary" />}
       label="Quyền quản trị viên"
       sx={{ mt: 2 }}
      />
     </DialogContent>
     <DialogActions>
      <Button onClick={() => setOpen(false)}>Hủy</Button>
      <Button type="submit" variant="contained">
       Tạo
      </Button>
     </DialogActions>
    </form>{" "}
   </Dialog>
   {/* Dialog chỉnh sửa người dùng */}
   <Dialog
    open={editOpen}
    onClose={() => setEditOpen(false)}
    maxWidth="sm"
    fullWidth
   >
    <form onSubmit={handleSubmitEdit(onEditSubmit)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <Edit sx={{ mr: 1 }} />
       Chỉnh sửa người dùng
      </Box>
     </DialogTitle>
     <DialogContent>
      <TextField
       {...registerEdit("phoneNumber", {
        required: "Số điện thoại là bắt buộc",
        pattern: {
         value: /^[0-9]{10,11}$/,
         message: "Số điện thoại không hợp lệ",
        },
       })}
       label="Số điện thoại"
       fullWidth
       margin="normal"
       error={!!errorsEdit.phoneNumber}
       helperText={errorsEdit.phoneNumber?.message}
      />
      <TextField
       {...registerEdit("fullName")}
       label="Tên đầy đủ (tùy chọn)"
       fullWidth
       margin="normal"
      />
      <FormControlLabel
       control={<Switch {...registerEdit("isAdmin")} color="primary" />}
       label="Quyền quản trị viên"
       sx={{ mt: 2 }}
      />
     </DialogContent>
     <DialogActions>
      <Button onClick={() => setEditOpen(false)}>Hủy</Button>
      <Button type="submit" variant="contained">
       Cập nhật
      </Button>
     </DialogActions>
    </form>
   </Dialog>
  </Box>
 );
}
