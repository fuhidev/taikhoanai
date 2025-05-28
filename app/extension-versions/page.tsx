"use client";

import {
 Add,
 Delete,
 Download,
 Edit,
 Extension,
 Publish,
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ExtensionVersion {
 id: string;
 version: string;
 downloadUrl: string;
 releaseNotes: string;
 forceUpdate: boolean;
 isCurrent: boolean;
 publishedAt: Date | null;
 createdAt: Date;
}

interface CreateVersionForm {
 version: string;
 downloadUrl: string;
 releaseNotes: string;
 forceUpdate: boolean;
 publishNow: boolean;
}

export default function ExtensionVersionsPage() {
 const [versions, setVersions] = useState<ExtensionVersion[]>([]);
 const [loading, setLoading] = useState(true);
 const [open, setOpen] = useState(false);
 const [editingVersion, setEditingVersion] = useState<ExtensionVersion | null>(
  null
 );
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
 } = useForm<CreateVersionForm>();

 const loadVersions = async () => {
  try {
   setLoading(true);
   const response = await fetch("/api/extension/versions");
   const data = await response.json();

   if (data.success) {
    setVersions(data.versions);
   } else {
    setAlert({ type: "error", message: "Có lỗi khi tải danh sách versions" });
   }
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi tải danh sách versions" });
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadVersions();
 }, []);

 const onSubmit = async (data: CreateVersionForm) => {
  try {
   const url = editingVersion
    ? `/api/extension/versions/${editingVersion.id}`
    : "/api/extension/versions";

   const method = editingVersion ? "PUT" : "POST";

   const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
   });

   const result = await response.json();

   if (result.success) {
    setAlert({
     type: "success",
     message: editingVersion
      ? "Cập nhật version thành công"
      : "Tạo version thành công",
    });
    setOpen(false);
    setEditingVersion(null);
    reset();
    loadVersions();
   } else {
    setAlert({ type: "error", message: result.error || "Có lỗi xảy ra" });
   }
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi lưu version" });
  }
 };

 const handleOpenDialog = (version?: ExtensionVersion) => {
  if (version) {
   setEditingVersion(version);
   setValue("version", version.version);
   setValue("downloadUrl", version.downloadUrl);
   setValue("releaseNotes", version.releaseNotes);
   setValue("forceUpdate", version.forceUpdate);
   setValue("publishNow", false);
  } else {
   setEditingVersion(null);
   reset();
  }
  setOpen(true);
 };

 const handlePublish = async (version: ExtensionVersion) => {
  if (!confirm(`Bạn có chắc muốn publish version ${version.version}?`)) return;

  try {
   const response = await fetch(
    `/api/extension/versions/${version.id}/publish`,
    {
     method: "POST",
    }
   );

   const result = await response.json();

   if (result.success) {
    setAlert({ type: "success", message: result.message });
    loadVersions();
   } else {
    setAlert({ type: "error", message: result.error });
   }
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi publish version" });
  }
 };

 const handleDelete = async (version: ExtensionVersion) => {
  if (version.isCurrent) {
   setAlert({ type: "error", message: "Không thể xóa version đang active" });
   return;
  }

  if (!confirm(`Bạn có chắc muốn xóa version ${version.version}?`)) return;

  try {
   const response = await fetch(`/api/extension/versions/${version.id}`, {
    method: "DELETE",
   });

   const result = await response.json();

   if (result.success) {
    setAlert({ type: "success", message: "Xóa version thành công" });
    loadVersions();
   } else {
    setAlert({ type: "error", message: result.error });
   }
  } catch {
   setAlert({ type: "error", message: "Có lỗi khi xóa version" });
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
     Quản lý Extension Versions
    </Typography>
    <Button
     variant="contained"
     startIcon={<Add />}
     onClick={() => handleOpenDialog()}
    >
     Thêm version mới
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
       <TableCell>Version</TableCell>
       <TableCell>Status</TableCell>
       <TableCell>Force Update</TableCell>
       <TableCell>Download URL</TableCell>
       <TableCell>Published At</TableCell>
       <TableCell>Created At</TableCell>
       <TableCell>Thao tác</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {loading ? (
       <TableRow>
        <TableCell colSpan={7} align="center">
         Đang tải...
        </TableCell>
       </TableRow>
      ) : versions.length === 0 ? (
       <TableRow>
        <TableCell colSpan={7} align="center">
         Chưa có version nào
        </TableCell>
       </TableRow>
      ) : (
       versions.map((version) => (
        <TableRow key={version.id}>
         <TableCell>
          <Box>
           <Typography variant="body2" fontWeight="bold">
            {version.version}
           </Typography>
           {version.releaseNotes && (
            <Typography variant="caption" color="text.secondary">
             {version.releaseNotes}
            </Typography>
           )}
          </Box>
         </TableCell>
         <TableCell>
          <Chip
           label={version.isCurrent ? "Current" : "Draft"}
           color={version.isCurrent ? "success" : "default"}
           size="small"
          />
         </TableCell>
         <TableCell>
          <Chip
           label={version.forceUpdate ? "Required" : "Optional"}
           color={version.forceUpdate ? "error" : "info"}
           size="small"
          />
         </TableCell>
         <TableCell>
          {version.downloadUrl ? (
           <Button
            size="small"
            startIcon={<Download />}
            href={version.downloadUrl}
            target="_blank"
           >
            Download
           </Button>
          ) : (
           "-"
          )}
         </TableCell>
         <TableCell>
          {version.publishedAt
           ? format(version.publishedAt, "dd/MM/yyyy HH:mm")
           : "-"}
         </TableCell>
         <TableCell>{format(version.createdAt, "dd/MM/yyyy HH:mm")}</TableCell>
         <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
           {!version.isCurrent && (
            <IconButton
             onClick={() => handlePublish(version)}
             color="success"
             size="small"
            >
             <Publish />
            </IconButton>
           )}
           <IconButton
            onClick={() => handleOpenDialog(version)}
            color="primary"
            size="small"
           >
            <Edit />
           </IconButton>
           {!version.isCurrent && (
            <IconButton
             onClick={() => handleDelete(version)}
             color="error"
             size="small"
            >
             <Delete />
            </IconButton>
           )}
          </Box>
         </TableCell>
        </TableRow>
       ))
      )}
     </TableBody>
    </Table>
   </TableContainer>

   {/* Dialog tạo/sửa version */}
   <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
    <form onSubmit={handleSubmit(onSubmit)}>
     <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
       <Extension sx={{ mr: 1 }} />
       {editingVersion ? "Chỉnh sửa version" : "Thêm version mới"}
      </Box>
     </DialogTitle>
     <DialogContent>
      <TextField
       {...register("version", {
        required: "Version là bắt buộc",
        pattern: {
         value: /^\d+\.\d+\.\d+$/,
         message: "Version phải có format x.y.z",
        },
       })}
       label="Version (x.y.z)"
       fullWidth
       margin="normal"
       error={!!errors.version}
       helperText={errors.version?.message}
       disabled={!!editingVersion}
       placeholder="1.0.0"
      />

      <TextField
       {...register("downloadUrl")}
       label="Download URL"
       fullWidth
       margin="normal"
       placeholder="https://domain.com/extension-v1.0.0.zip"
      />

      <TextField
       {...register("releaseNotes")}
       label="Release Notes"
       fullWidth
       multiline
       rows={3}
       margin="normal"
       placeholder="Cập nhật tính năng mới..."
      />

      <FormControlLabel
       control={<Checkbox {...register("forceUpdate")} />}
       label="Force Update (bắt buộc cập nhật)"
      />

      {!editingVersion && (
       <FormControlLabel
        control={<Checkbox {...register("publishNow")} />}
        label="Publish ngay lập tức"
       />
      )}
     </DialogContent>
     <DialogActions>
      <Button onClick={() => setOpen(false)}>Hủy</Button>
      <Button type="submit" variant="contained">
       {editingVersion ? "Cập nhật" : "Tạo"}
      </Button>
     </DialogActions>
    </form>
   </Dialog>
  </Box>
 );
}
