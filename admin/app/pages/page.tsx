"use client";

import { Page } from "@/types";
import {
  Add,
  Delete,
  Description,
  Edit,
  Publish,
  Unpublished,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Import Markdown editor with dynamic import to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface PageForm {
 title: string;
 slug: string;
 content: string;
 isPublished: boolean;
}

export default function PagesAdminPage() {
 const [pages, setPages] = useState<Page[]>([]);
 const [loading, setLoading] = useState(true);
 const [open, setOpen] = useState(false);
 const [editingPage, setEditingPage] = useState<Page | null>(null);
 const [alert, setAlert] = useState<{
  type: "success" | "error";
  message: string;
 } | null>(null);
 const [contentValue, setContentValue] = useState<string>("");

 const {
  register,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
  watch,
 } = useForm<PageForm>({
  defaultValues: {
   isPublished: false,
  },
 });

 const title = watch("title");

 // Generate slug from title
 useEffect(() => {
  if (!editingPage && title) {
   const generatedSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
   setValue("slug", generatedSlug);
  }
 }, [title, setValue, editingPage]);
 const loadPages = async () => {
  try {
   setLoading(true);
   const response = await fetch("/api/pages");
   const data = await response.json();

   if (data.success) {
    setPages(data.pages);
   } else {
    setAlert({ type: "error", message: "Có lỗi khi tải danh sách trang" });
   }
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tải danh sách trang" });
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadPages();
 }, []);
 const onSubmit = async (data: PageForm) => {
  try {
   // Use the content from MDEditor
   const pageData = {
    ...data,
    content: contentValue,
   };

   const url = editingPage ? `/api/pages/${editingPage.id}` : "/api/pages";

   const method = editingPage ? "PUT" : "POST";

   const response = await fetch(url, {
    method,
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify(pageData),
   });

   const result = await response.json();

   if (result.success) {
    setAlert({
     type: "success",
     message: editingPage
      ? "Cập nhật trang thành công"
      : "Tạo trang mới thành công",
    });
    setOpen(false);
    setEditingPage(null);
    reset();
    setContentValue("");
    loadPages();
   } else {
    setAlert({
     type: "error",
     message: result.error || "Có lỗi khi lưu trang",
    });
   }
  } catch  {
   setAlert({ type: "error", message: "Có lỗi khi lưu trang" });
  }
 };

 const handleOpenDialog = (page?: Page) => {
  if (page) {
   setEditingPage(page);
   setValue("title", page.title);
   setValue("slug", page.slug);
   setContentValue(page.content);
   setValue("isPublished", page.isPublished);
  } else {
   setEditingPage(null);
   reset();
   setContentValue("");
  }
  setOpen(true);
 };
 const handleTogglePublish = async (page: Page) => {
  try {
   const response = await fetch(`/api/pages/${page.id}/toggle-publish`, {
    method: "POST",
   });

   const result = await response.json();

   if (result.success) {
    setAlert({
     type: "success",
     message: `Trang đã được ${page.isPublished ? "hủy" : "xuất"} bản`,
    });
    loadPages();
   } else {
    setAlert({
     type: "error",
     message: result.error || "Có lỗi khi cập nhật trạng thái",
    });
   }
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi cập nhật trạng thái" });
  }
 };
 const handleDelete = async (page: Page) => {
  if (!confirm(`Bạn có chắc muốn xóa trang "${page.title}"?`)) return;

  try {
   const response = await fetch(`/api/pages/${page.id}`, {
    method: "DELETE",
   });

   const result = await response.json();

   if (result.success) {
    setAlert({ type: "success", message: "Xóa trang thành công" });
    loadPages();
   } else {
    setAlert({
     type: "error",
     message: result.error || "Có lỗi khi xóa trang",
    });
   }
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi xóa trang" });
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
     Quản lý Trang
    </Typography>
    <Button
     variant="contained"
     startIcon={<Add />}
     onClick={() => handleOpenDialog()}
    >
     Thêm trang mới
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
       <TableCell>Tiêu đề</TableCell>
       <TableCell>Slug</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Đã cập nhật</TableCell>
       <TableCell>Đã tạo</TableCell>
       <TableCell>Thao tác</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {loading ? (
       <TableRow>
        <TableCell colSpan={6} align="center">
         Đang tải...
        </TableCell>
       </TableRow>
      ) : pages.length === 0 ? (
       <TableRow>
        <TableCell colSpan={6} align="center">
         Chưa có trang nào
        </TableCell>
       </TableRow>
      ) : (
       pages.map((page) => (
        <TableRow key={page.id}>
         <TableCell>
          <Typography variant="body2" fontWeight="bold">
           {page.title}
          </Typography>
         </TableCell>
         <TableCell>{page.slug}</TableCell>
         <TableCell>
          <Chip
           label={page.isPublished ? "Đã xuất bản" : "Bản nháp"}
           color={page.isPublished ? "success" : "default"}
           size="small"
          />
         </TableCell>
         <TableCell>{format(page.updatedAt, "dd/MM/yyyy HH:mm")}</TableCell>
         <TableCell>{format(page.createdAt, "dd/MM/yyyy HH:mm")}</TableCell>
         <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
           <IconButton
            onClick={() => handleTogglePublish(page)}
            color={page.isPublished ? "default" : "success"}
            size="small"
            title={page.isPublished ? "Hủy xuất bản" : "Xuất bản"}
           >
            {page.isPublished ? <Unpublished /> : <Publish />}
           </IconButton>
           <IconButton
            onClick={() => handleOpenDialog(page)}
            color="primary"
            size="small"
            title="Chỉnh sửa"
           >
            <Edit />
           </IconButton>
           <IconButton
            onClick={() => handleDelete(page)}
            color="error"
            size="small"
            title="Xóa"
           >
            <Delete />
           </IconButton>
          </Box>
         </TableCell>
        </TableRow>
       ))
      )}
     </TableBody>
    </Table>
   </TableContainer>

   {/* Dialog tạo/sửa trang */}
   <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
    <form onSubmit={handleSubmit(onSubmit)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <Description sx={{ mr: 1 }} />
       {editingPage ? "Chỉnh sửa trang" : "Thêm trang mới"}
      </Box>
     </DialogTitle>
     <DialogContent>
      <TextField
       {...register("title", { required: "Tiêu đề là bắt buộc" })}
       label="Tiêu đề"
       fullWidth
       margin="normal"
       error={!!errors.title}
       helperText={errors.title?.message}
       placeholder="Tiêu đề trang"
      />

      <TextField
       {...register("slug", {
        required: "Slug là bắt buộc",
        pattern: {
         value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
         message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
        },
       })}
       label="Slug (dùng cho URL)"
       fullWidth
       margin="normal"
       error={!!errors.slug}
       helperText={errors.slug?.message}
       placeholder="slug-cua-trang"
      />

      <Box sx={{ my: 2 }}>
       <Typography variant="body2" gutterBottom>
        Nội dung (Markdown)
       </Typography>
       <div data-color-mode="light">
        <MDEditor
         value={contentValue}
         onChange={(value) => setContentValue(value || "")}
         height={400}
         preview="edit"
        />
       </div>
      </Box>

      <FormControlLabel
       control={<Checkbox {...register("isPublished")} />}
       label="Xuất bản ngay"
       sx={{ mt: 1 }}
      />
     </DialogContent>
     <DialogActions>
      <Button onClick={() => setOpen(false)}>Hủy</Button>
      <Button type="submit" variant="contained">
       {editingPage ? "Cập nhật" : "Tạo"}
      </Button>
     </DialogActions>
    </form>
   </Dialog>
  </Box>
 );
}
