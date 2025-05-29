"use client";

import {
 createProduct,
 deleteProduct,
 getAllProducts,
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
 Chip,
 Dialog,
 DialogActions,
 DialogContent,
 DialogTitle,
 IconButton,
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

interface ProductForm {
 name: string;
 duration: number;
 cookie: string;
 website: string;
 image: string;
 price: number;
 originalPrice?: number;
}

export default function ProductsPage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
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

 const loadProducts = async () => {
  try {
   setLoading(true);
   const productsData = await getAllProducts();
   setProducts(productsData);
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tải danh sách sản phẩm" });
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadProducts();
 }, []);

 const handleOpenDialog = (product?: Product) => {
  if (product) {
   setEditingProduct(product);
   setValue("name", product.name);
   setValue("duration", product.duration);
   setValue("cookie", product.cookie);
   setValue("website", product.website);
   setValue("image", product.image || "");
   setValue("price", product.price || 0);
   setValue("originalPrice", product.originalPrice || 0);
  } else {
   setEditingProduct(null);
   reset();
  }
  setOpen(true);
 };

 const onSubmit = async (data: ProductForm) => {
  try {
   const productData = {
    ...data,
    originalPrice: data.originalPrice || undefined,
   };

   if (editingProduct) {
    await updateProduct(editingProduct.id, productData);
    setAlert({ type: "success", message: "Cập nhật sản phẩm thành công" });
   } else {
    await createProduct(
     data.name,
     data.duration,
     data.cookie,
     data.website,
     data.image,
     data.price,
     data.originalPrice
    );
    setAlert({ type: "success", message: "Tạo sản phẩm thành công" });
   }
   setOpen(false);
   reset();
   setEditingProduct(null);
   loadProducts();
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi lưu sản phẩm" });
  }
 };

 const handleDelete = async (product: Product) => {
  if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
   try {
    await deleteProduct(product.id);
    setAlert({ type: "success", message: "Xóa sản phẩm thành công" });
    loadProducts();
   } catch {
    setAlert({ type: "error", message: "Có lỗi khi xóa sản phẩm" });
   }
  }
 };

 const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
   style: "currency",
   currency: "VND",
  }).format(price);
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
     Quản lý sản phẩm
    </Typography>
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
   )}

   <TableContainer component={Paper}>
    <Table>
     <TableHead>
      <TableRow>
       <TableCell>Hình ảnh</TableCell>
       <TableCell>Tên sản phẩm</TableCell>
       <TableCell>Giá</TableCell>
       <TableCell>Thời hạn (ngày)</TableCell>
       <TableCell>Website</TableCell>
       <TableCell>Cookie</TableCell>
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
      ) : products.length === 0 ? (
       <TableRow>
        <TableCell colSpan={8} align="center">
         Chưa có sản phẩm nào
        </TableCell>
       </TableRow>
      ) : (
       products.map((product) => (
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
           <Chip label={product.name} color="primary" sx={{ mr: 1 }} />
          </Box>
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
       ))
      )}
     </TableBody>
    </Table>
   </TableContainer>

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
       {...register("cookie", { required: "Cookie là bắt buộc" })}
       label="Cookie"
       fullWidth
       multiline
       rows={4}
       margin="normal"
       error={!!errors.cookie}
       helperText={errors.cookie?.message}
       placeholder="session_id=...; auth_token=..."
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
