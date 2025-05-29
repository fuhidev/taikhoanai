"use client";

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
 Paper,
 Table,
 TableBody,
 TableCell,
 TableContainer,
 TableHead,
 TableRow,
 Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { UserSession } from "../../types";

export default function SessionsPage() {
 const [sessions, setSessions] = useState<UserSession[]>([]);
 const [showAll, setShowAll] = useState(false);
 const [revokeDialog, setRevokeDialog] = useState<{
  open: boolean;
  session: UserSession | null;
 }>({
  open: false,
  session: null,
 });

 const fetchSessions = useCallback(async () => {
  try {
   const response = await fetch(`/api/admin/sessions?all=${showAll}`);
   const data = await response.json();

   if (data.success) {
    setSessions(data.sessions);
   }
  } catch (error) {
   console.error("Error fetching sessions:", error);
  }
 }, [showAll]);

 useEffect(() => {
  fetchSessions();

  // Auto refresh every 30 seconds
  const interval = setInterval(fetchSessions, 30000);
  return () => clearInterval(interval);
 }, [fetchSessions]);
 const handleRevokeSession = async (sessionId: string) => {
  try {
   const response = await fetch("/api/admin/revoke-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
   });

   const data = await response.json();

   if (data.success) {
    setSessions(
     sessions.map((s) =>
      s.id === sessionId
       ? { ...s, isActive: false, revokedAt: Date.now(), revokedBy: "admin" }
       : s
     )
    );
    setRevokeDialog({ open: false, session: null });
   }
  } catch (error) {
   console.error("Error revoking session:", error);
  }
 };

 const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("vi-VN");
 };

 const getActiveTime = (session: UserSession) => {
  const now = Date.now();
  const diff = now - session.lastActive;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
 };

 return (
  <Container maxWidth="lg" sx={{ py: 4 }}>
   {" "}
   <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={3}
   >
    <Typography variant="h4" component="h1">
     Quản lý Phiên đăng nhập
    </Typography>
    <Box display="flex" gap={2}>
     <Button
      variant={showAll ? "contained" : "outlined"}
      onClick={() => setShowAll(!showAll)}
     >
      {showAll ? "Chỉ đang hoạt động" : "Tất cả phiên"}
     </Button>
     <Button variant="outlined" onClick={fetchSessions}>
      Làm mới
     </Button>
    </Box>
   </Box>
   <Alert severity="info" sx={{ mb: 3 }}>
    Hệ thống chỉ cho phép 1 thiết bị đăng nhập đồng thời cho mỗi tài khoản. Đăng
    nhập thiết bị mới sẽ tự động thu hồi phiên cũ.
   </Alert>
   <TableContainer component={Paper}>
    <Table>
     <TableHead>
      <TableRow>
       <TableCell>Người dùng</TableCell>
       <TableCell>Thiết bị</TableCell>
       <TableCell>Thời gian đăng nhập</TableCell>
       <TableCell>Hoạt động cuối</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Hành động</TableCell>
      </TableRow>
     </TableHead>
     <TableBody>
      {" "}
      {sessions.map((session) => (
       <TableRow key={session.id}>
        {" "}
        <TableCell>
         <Box>
          <Typography variant="body2" fontWeight="bold">
           {session.userInfo?.phoneNumber || session.userId}
          </Typography>
          {session.userInfo?.fullName && (
           <Typography variant="caption" color="text.secondary">
            {session.userInfo.fullName}
           </Typography>
          )}
         </Box>
        </TableCell>
        <TableCell>
         <Box>
          <Typography variant="body2">
           {session.deviceInfo.deviceName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
           {session.deviceInfo.browser} • {session.deviceInfo.os}
          </Typography>
          {session.deviceInfo.ip && (
           <Typography variant="caption" color="text.secondary" display="block">
            IP: {session.deviceInfo.ip}
           </Typography>
          )}
         </Box>
        </TableCell>
        <TableCell>
         <Typography variant="body2">
          {formatTime(session.loginTime)}
         </Typography>
        </TableCell>
        <TableCell>
         <Typography variant="body2">{getActiveTime(session)}</Typography>
        </TableCell>
        <TableCell>
         {session.isActive ? (
          <Chip label="Đang hoạt động" color="success" size="small" />
         ) : (
          <Chip
           label={`Thu hồi bởi ${session.revokedBy}`}
           color="error"
           size="small"
          />
         )}
        </TableCell>
        <TableCell>
         {session.isActive && (
          <Button
           size="small"
           color="error"
           onClick={() => setRevokeDialog({ open: true, session })}
          >
           Thu hồi
          </Button>
         )}
        </TableCell>
       </TableRow>
      ))}
     </TableBody>
    </Table>
   </TableContainer>
   {/* Revoke Confirmation Dialog */}
   <Dialog
    open={revokeDialog.open}
    onClose={() => setRevokeDialog({ open: false, session: null })}
   >
    <DialogTitle>Thu hồi phiên đăng nhập</DialogTitle>{" "}
    <DialogContent>
     <Typography>Bạn có chắc chắn muốn thu hồi phiên đăng nhập của:</Typography>
     <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
      <Typography variant="body2" fontWeight="bold">
       Người dùng:{" "}
       {revokeDialog.session?.userInfo?.phoneNumber ||
        revokeDialog.session?.userId}
      </Typography>
      {revokeDialog.session?.userInfo?.fullName && (
       <Typography variant="body2">
        Tên: {revokeDialog.session.userInfo.fullName}
       </Typography>
      )}
      <Typography variant="body2">
       Thiết bị: {revokeDialog.session?.deviceInfo.deviceName}
      </Typography>
     </Box>
     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      Người dùng sẽ bị đăng xuất ngay lập tức.
     </Typography>
    </DialogContent>
    <DialogActions>
     <Button onClick={() => setRevokeDialog({ open: false, session: null })}>
      Hủy
     </Button>
     <Button
      color="error"
      onClick={() =>
       revokeDialog.session && handleRevokeSession(revokeDialog.session.id)
      }
     >
      Thu hồi
     </Button>
    </DialogActions>
   </Dialog>
  </Container>
 );
}
