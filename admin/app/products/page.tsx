"use client";

import { IntegratedServerTable } from "@/components";
import type { IntegratedServerTableRef } from "@/components/IntegratedServerTable";
import {
 createProduct,
 deleteProduct,
 getPaginatedProducts,
 updateProduct,
} from "@/lib/firebaseService";
import { Product } from "@/types";
import {
 Add,
 Delete,
 Edit,
 Image as ImageIcon,
 Inventory,
} from "@mui/icons-material";
import {
 Alert,
 Avatar,
 Box,
 Button,
 Dialog,
 DialogActions,
 DialogContent,
 DialogTitle,
 IconButton,
 TableCell,
 TableHead,
 TableRow,
 TextField,
 Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { formatPrice } from "../utils/formatNumber";

type ProductForm = Omit<Product, "id">;
export default function ProductsPage() {
 // Ref to access table methods
 const tableRef = useRef<IntegratedServerTableRef<Product>>(null);

 const [open, setOpen] = useState(false);
 const [editingProduct, setEditingProduct] = useState<Product | null>(null);
 const [alert, setAlert] = useState<{
  type: "success" | "error";
  message: string;
 } | null>(null);
 const {
  register,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
 } = useForm<ProductForm>();

 const handleOpenDialog = (product?: Product) => {
  if (product) {
   setEditingProduct(product);
   setValue("name", product.name);
   setValue("duration", product.duration);
   setValue("cookie", product.cookie);
   setValue("localStorage", product.localStorage || "");
   setValue("website", product.website);
   setValue("image", product.image || "");
   setValue("price", product.price || 0);
   setValue("originalPrice", product.originalPrice || 0);
   // Thêm setValue cho soldCount nếu có
   setValue("soldCount", product.soldCount ?? 0);
   setValue("description", product.description || "");
  } else {
   setEditingProduct(null);
   reset();
  }
  setOpen(true);
 };

 const onSubmit = async (data: ProductForm & { soldCount?: number }) => {
  try {
   const productData = {
    ...data,
    originalPrice: data.originalPrice || undefined,
    // Đảm bảo truyền soldCount khi cập nhật
    ...(editingProduct ? { soldCount: data.soldCount ?? 0 } : {}),
   };

   if (editingProduct) {
    await updateProduct(editingProduct.id, productData);
    setAlert({ type: "success", message: "Cập nhật sản phẩm thành công" });
   } else {
    await createProduct({ product: data });
    setAlert({ type: "success", message: "Tạo sản phẩm thành công" });
   }
   setOpen(false);
   reset();
   setEditingProduct(null);
   tableRef.current?.refresh();
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi lưu sản phẩm" });
  }
 };

 const handleDelete = async (product: Product) => {
  if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
   try {
    await deleteProduct(product.id);
    setAlert({ type: "success", message: "Xóa sản phẩm thành công" });
    tableRef.current?.refresh();
   } catch {
    setAlert({ type: "error", message: "Có lỗi khi xóa sản phẩm" });
   }
  }
 };

 return (
  <Box>
   <Box
    sx={{
     display: "flex",
     justifyContent: "end",
     alignItems: "center",
     mb: 3,
    }}
   >
    <Button
     variant="contained"
     startIcon={<Add />}
     onClick={() => handleOpenDialog()}
    >
     Thêm sản phẩm
    </Button>
   </Box>
   {alert && (
    <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
     {alert.message}
    </Alert>
   )}{" "}
   <IntegratedServerTable<Product>
    ref={tableRef}
    fetchFunction={getPaginatedProducts}
    initialLimit={10}
    orderByField="createdAt"
    orderDirection="desc"
    title="Quản lý sản phẩm"
    emptyMessage="Chưa có sản phẩm nào"
    renderHeader={() => (
     <TableHead>
      <TableRow>
       <TableCell>Hình ảnh</TableCell>
       <TableCell>Tên sản phẩm</TableCell>
       <TableCell>Giá</TableCell>
       <TableCell>Thời hạn (ngày)</TableCell>
       <TableCell>Đã bán</TableCell>
       <TableCell>Website</TableCell>
       <TableCell>Cookie</TableCell>
       <TableCell>Ngày tạo</TableCell>
       <TableCell>Thao tác</TableCell>
      </TableRow>
     </TableHead>
    )}
    renderRow={(product: Product) => (
     <TableRow key={product.id}>
      <TableCell>
       <Avatar
        src={product.image}
        sx={{ width: 60, height: 60 }}
        variant="rounded"
       >
        <ImageIcon />
       </Avatar>
      </TableCell>
      <TableCell>
       <Typography variant="body1" fontWeight="medium">
        {product.name}
       </Typography>
      </TableCell>
      <TableCell>
       <Box>
        <Typography variant="body1" fontWeight="bold" color="primary">
         {formatPrice(product.price || 0)}
        </Typography>
        {product.originalPrice &&
         product.originalPrice > (product.price || 0) && (
          <Typography
           variant="body2"
           sx={{ textDecoration: "line-through", color: "text.secondary" }}
          >
           {formatPrice(product.originalPrice)}
          </Typography>
         )}
       </Box>
      </TableCell>
      <TableCell>{product.duration} ngày</TableCell>
      <TableCell>
       <Typography variant="body2" color="secondary">
        {product.soldCount ?? 0}
       </Typography>
      </TableCell>
      <TableCell>
       <a href={product.website} target="_blank" rel="noopener noreferrer">
        {product.website}
       </a>
      </TableCell>
      <TableCell>
       <Typography
        variant="body2"
        sx={{
         maxWidth: 200,
         overflow: "hidden",
         textOverflow: "ellipsis",
         display: "-webkit-box",
         WebkitLineClamp: 3,
         WebkitBoxOrient: "vertical",
         fontFamily: "monospace",
         lineHeight: 1.2,
        }}
       >
        {product.cookie}
       </Typography>
      </TableCell>
      <TableCell>{format(product.createdAt, "dd/MM/yyyy")}</TableCell>
      <TableCell>
       <IconButton onClick={() => handleOpenDialog(product)} color="primary">
        <Edit />
       </IconButton>
       <IconButton onClick={() => handleDelete(product)} color="error">
        <Delete />
       </IconButton>
      </TableCell>
     </TableRow>
    )}
   />
   {/* Dialog tạo/sửa sản phẩm */}
   <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
    <form onSubmit={handleSubmit(onSubmit)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <Inventory sx={{ mr: 1 }} />
       {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      </Box>
     </DialogTitle>
     <DialogContent>
      <TextField
       {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
       label="Tên sản phẩm"
       fullWidth
       margin="normal"
       error={!!errors.name}
       helperText={errors.name?.message}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
       <TextField
        {...register("price", {
         required: "Giá sản phẩm là bắt buộc",
         min: { value: 0, message: "Giá phải lớn hơn hoặc bằng 0" },
        })}
        label="Giá sản phẩm (VND)"
        type="number"
        fullWidth
        margin="normal"
        error={!!errors.price}
        helperText={errors.price?.message}
       />

       <TextField
        {...register("originalPrice", {
         min: { value: 0, message: "Giá gốc phải lớn hơn hoặc bằng 0" },
        })}
        label="Giá gốc (VND) - Tùy chọn"
        type="number"
        fullWidth
        margin="normal"
        error={!!errors.originalPrice}
        helperText={
         errors.originalPrice?.message || "Để trống nếu không có giá gốc"
        }
       />
      </Box>

      <TextField
       {...register("image")}
       label="URL hình ảnh"
       fullWidth
       margin="normal"
       error={!!errors.image}
       helperText={errors.image?.message || "URL hình ảnh sản phẩm (tùy chọn)"}
       placeholder="https://example.com/image.jpg"
      />

      <TextField
       {...register("duration", {
        required: "Thời hạn sử dụng là bắt buộc",
        min: { value: 1, message: "Thời hạn phải lớn hơn 0" },
       })}
       label="Thời hạn sử dụng (ngày)"
       type="number"
       fullWidth
       margin="normal"
       error={!!errors.duration}
       helperText={errors.duration?.message}
      />

      <TextField
       {...register("website", {
        required: "Website là bắt buộc",
        pattern: {
         value: /^https?:\/\/.+/,
         message: "Website phải bắt đầu bằng http:// hoặc https://",
        },
       })}
       label="Website"
       fullWidth
       margin="normal"
       error={!!errors.website}
       helperText={errors.website?.message}
       placeholder="https://chat.openai.com"
      />

      <TextField
       {...register("cookie")}
       label="Cookie"
       fullWidth
       multiline
       rows={4}
       margin="normal"
       error={!!errors.cookie}
       helperText={errors.cookie?.message || "Cookie cho website (tùy chọn)"}
       placeholder="session_id=...; auth_token=..."
      />

      <TextField
       {...register("localStorage")}
       label="LocalStorage"
       fullWidth
       multiline
       rows={4}
       margin="normal"
       error={!!errors.localStorage}
       helperText={
        errors.localStorage?.message || "LocalStorage data dạng JSON (tùy chọn)"
       }
       placeholder='{"token": "...", "user_id": "..."}'
      />

      {/* Chỉ hiển thị trường soldCount khi chỉnh sửa sản phẩm */}
      {editingProduct && (
       <TextField
        {...register("soldCount", {
         min: { value: 0, message: "Đã bán phải >= 0" },
        })}
        label="Đã bán"
        type="number"
        fullWidth
        margin="normal"
        error={!!errors.soldCount}
        helperText={
         errors.soldCount?.message || "Số lượng đã bán (chỉ chỉnh sửa)"
        }
       />
      )}

      <TextField
       {...register("description")}
       label="Mô tả (Markdown)"
       fullWidth
       multiline
       rows={6}
       margin="normal"
       error={!!errors.description}
       helperText={
        errors.description?.message || "Bạn có thể nhập mô tả bằng Markdown"
       }
       placeholder="Nhập mô tả sản phẩm ở đây..."
      />
     </DialogContent>
     <DialogActions>
      <Button onClick={() => setOpen(false)}>Hủy</Button>
      <Button type="submit" variant="contained">
       {editingProduct ? "Cập nhật" : "Tạo"}
      </Button>
     </DialogActions>
    </form>
   </Dialog>
  </Box>
 );
}
