"use client";

import { IntegratedServerTable } from "@/components";
import type { IntegratedServerTableRef } from "@/components/IntegratedServerTable";
import { getPaginatedSessions, revokeSession } from "@/lib/firebaseService";
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
 TableCell,
 TableHead,
 TableRow,
 Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { UserSession } from "../../types";

export default function SessionsPage() {
 const tableRef = useRef<IntegratedServerTableRef<UserSession>>(null);
 const [revokeDialog, setRevokeDialog] = useState<{
  open: boolean;
  session: UserSession | null;
 }>({
  open: false,
  session: null,
 });

 const handleRevokeSession = async (sessionId: string) => {
  try {
   await revokeSession(sessionId, "admin");
   setRevokeDialog({ open: false, session: null });
   tableRef.current?.refresh();
  } catch (error) {
   console.error("Error revoking session:", error);
  }
 };

 const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("vi-VN");
 };

 return (
  <Container maxWidth="lg" sx={{ py: 4 }}>
   <Alert severity="info" sx={{ mb: 3 }}>
    Hệ thống chỉ cho phép 1 thiết bị đăng nhập đồng thời cho mỗi tài khoản. Đăng
    nhập thiết bị mới sẽ tự động thu hồi phiên cũ.
   </Alert>

   <IntegratedServerTable<UserSession>
    ref={tableRef}
    fetchFunction={getPaginatedSessions}
    initialLimit={10}
    orderByField="lastActive"
    orderDirection="desc"
    title="Quản lý Phiên đăng nhập"
    emptyMessage="Chưa có phiên đăng nhập nào"
    renderHeader={() => (
     <TableHead>
      <TableRow>
       <TableCell>Người dùng</TableCell>
       <TableCell>Thiết bị</TableCell>
       <TableCell>Thời gian đăng nhập</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Hành động</TableCell>
      </TableRow>
     </TableHead>
    )}
    renderRow={(session) => (
     <TableRow key={session.id}>
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
        <Typography variant="body2">{session.deviceInfo.deviceName}</Typography>
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
       <Typography variant="body2">{formatTime(session.loginTime)}</Typography>
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
    )}
   />

   {/* Revoke Confirmation Dialog */}
   <Dialog
    open={revokeDialog.open}
    onClose={() => setRevokeDialog({ open: false, session: null })}
   >
    <DialogTitle>Thu hồi phiên đăng nhập</DialogTitle>
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
