"use client";

import {
 Add as AddIcon,
 Delete as DeleteIcon,
 Edit as EditIcon,
 Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
 Alert,
 Box,
 Button,
 Chip,
 Container,
 Dialog,
 DialogActions,
 DialogContent,
 DialogTitle,
 IconButton,
 Paper,
 Switch,
 Table,
 TableBody,
 TableCell,
 TableContainer,
 TableHead,
 TableRow,
 TextField,
 Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Advertisement {
 id: string;
 name: string;
 imageUrl: string;
 isActive: boolean;
 priority: number;
 createdAt: Date;
 updatedAt: Date;
}

export default function AdvertisementsPage() {
 const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [openDialog, setOpenDialog] = useState(false);
 const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
 const [previewDialog, setPreviewDialog] = useState(false);
 const [previewAd, setPreviewAd] = useState<Advertisement | null>(null);

 // Form state
 const [formData, setFormData] = useState({
  name: "",
  imageUrl: "",
  priority: 0,
 });

 useEffect(() => {
  fetchAdvertisements();
 }, []);

 const fetchAdvertisements = async () => {
  try {
   setLoading(true);
   const response = await fetch("/api/advertisements");
   if (!response.ok) throw new Error("Failed to fetch advertisements");
   const data = await response.json();
   setAdvertisements(
    data.map((ad: Advertisement) => ({
     ...ad,
     createdAt: new Date(ad.createdAt),
     updatedAt: new Date(ad.updatedAt),
    }))
   );
  } catch (err) {
   setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
   setLoading(false);
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
   const url = editingAd
    ? `/api/advertisements/${editingAd.id}`
    : "/api/advertisements";

   const method = editingAd ? "PUT" : "POST";

   const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
   });

   if (!response.ok) throw new Error("Failed to save advertisement");

   await fetchAdvertisements();
   handleCloseDialog();
  } catch (err) {
   setError(err instanceof Error ? err.message : "An error occurred");
  }
 };

 const handleToggleActive = async (id: string, isActive: boolean) => {
  try {
   const response = await fetch(`/api/advertisements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive: !isActive }),
   });

   if (!response.ok) throw new Error("Failed to update advertisement");
   await fetchAdvertisements();
  } catch (err) {
   setError(err instanceof Error ? err.message : "An error occurred");
  }
 };

 const handleDelete = async (id: string) => {
  if (!confirm("Bạn có chắc chắn muốn xóa quảng cáo này?")) return;

  try {
   const response = await fetch(`/api/advertisements/${id}`, {
    method: "DELETE",
   });

   if (!response.ok) throw new Error("Failed to delete advertisement");
   await fetchAdvertisements();
  } catch (err) {
   setError(err instanceof Error ? err.message : "An error occurred");
  }
 };

 const handleOpenDialog = (ad?: Advertisement) => {
  if (ad) {
   setEditingAd(ad);
   setFormData({
    name: ad.name,
    imageUrl: ad.imageUrl,
    priority: ad.priority,
   });
  } else {
   setEditingAd(null);
   setFormData({ name: "", imageUrl: "", priority: 0 });
  }
  setOpenDialog(true);
 };

 const handleCloseDialog = () => {
  setOpenDialog(false);
  setEditingAd(null);
  setFormData({ name: "", imageUrl: "", priority: 0 });
 };

 const handlePreview = (ad: Advertisement) => {
  setPreviewAd(ad);
  setPreviewDialog(true);
 };

 if (loading) return <div>Loading...</div>;

 return (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
   <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={3}
   >
    <Typography variant="h4" component="h1">
     Quản lý Quảng cáo
    </Typography>
    <Button
     variant="contained"
     startIcon={<AddIcon />}
     onClick={() => handleOpenDialog()}
    >
     Thêm quảng cáo
    </Button>
   </Box>

   {error && (
    <Alert severity="error" sx={{ mb: 2 }}>
     {error}
    </Alert>
   )}

   <TableContainer component={Paper}>
    <Table>
     <TableHead>
      <TableRow>
       <TableCell>Tên quảng cáo</TableCell>
       <TableCell>Hình ảnh</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Độ ưu tiên</TableCell>
       <TableCell>Ngày tạo</TableCell>
       <TableCell>Thao tác</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {advertisements.map((ad) => (
       <TableRow key={ad.id}>
        <TableCell>{ad.name}</TableCell>
        <TableCell>
         <Box width={60} height={40} position="relative">
          <Image
           src={ad.imageUrl}
           alt={ad.name}
           fill
           style={{ objectFit: "cover", borderRadius: 4 }}
          />
         </Box>
        </TableCell>
        <TableCell>
         <Switch
          checked={ad.isActive}
          onChange={() => handleToggleActive(ad.id, ad.isActive)}
         />
         <Chip
          label={ad.isActive ? "Hoạt động" : "Tạm dừng"}
          color={ad.isActive ? "success" : "default"}
          size="small"
          sx={{ ml: 1 }}
         />
        </TableCell>
        <TableCell>{ad.priority}</TableCell>
        <TableCell>{ad.createdAt.toLocaleDateString("vi-VN")}</TableCell>
        <TableCell>
         <IconButton onClick={() => handlePreview(ad)} color="info">
          <VisibilityIcon />
         </IconButton>
         <IconButton onClick={() => handleOpenDialog(ad)} color="primary">
          <EditIcon />
         </IconButton>
         <IconButton onClick={() => handleDelete(ad.id)} color="error">
          <DeleteIcon />
         </IconButton>
        </TableCell>
       </TableRow>
      ))}
     </TableBody>
    </Table>
   </TableContainer>

   {/* Dialog thêm/sửa quảng cáo */}
   <Dialog
    open={openDialog}
    onClose={handleCloseDialog}
    maxWidth="sm"
    fullWidth
   >
    <DialogTitle>
     {editingAd ? "Chỉnh sửa quảng cáo" : "Thêm quảng cáo mới"}
    </DialogTitle>
    <DialogContent>
     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
       fullWidth
       label="Tên quảng cáo"
       value={formData.name}
       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
       margin="normal"
       required
      />
      <TextField
       fullWidth
       label="URL hình ảnh"
       value={formData.imageUrl}
       onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
       margin="normal"
       required
      />
      <TextField
       fullWidth
       type="number"
       label="Độ ưu tiên"
       value={formData.priority}
       onChange={(e) =>
        setFormData({ ...formData, priority: parseInt(e.target.value) })
       }
       margin="normal"
       helperText="Số càng cao càng được ưu tiên hiển thị"
      />
     </Box>
    </DialogContent>
    <DialogActions>
     <Button onClick={handleCloseDialog}>Hủy</Button>
     <Button onClick={handleSubmit} variant="contained">
      {editingAd ? "Cập nhật" : "Thêm"}
     </Button>
    </DialogActions>
   </Dialog>

   {/* Dialog preview quảng cáo */}
   <Dialog
    open={previewDialog}
    onClose={() => setPreviewDialog(false)}
    maxWidth="md"
    fullWidth
   >
    <DialogTitle>Xem trước quảng cáo</DialogTitle>
    <DialogContent>
     {previewAd && (
      <Box
       sx={{
        position: "relative",
        width: "100%",
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0,0,0,0.5)",
        borderRadius: 2,
       }}
      >
       <Box
        sx={{
         position: "relative",
         maxWidth: "90%",
         maxHeight: "90%",
        }}
       >
        <Image
         src={previewAd.imageUrl}
         alt={previewAd.name}
         width={500}
         height={300}
         style={{
          objectFit: "contain",
          borderRadius: 8,
         }}
        />
       </Box>
      </Box>
     )}
    </DialogContent>
    <DialogActions>
     <Button onClick={() => setPreviewDialog(false)}>Đóng</Button>
    </DialogActions>
   </Dialog>
  </Container>
 );
}
