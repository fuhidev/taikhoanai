"use client";

import SearchableTable from "@/components/SearchableTable";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
 Box,
 Chip,
 Divider,
 IconButton,
 TableCell,
 TableHead,
 TableRow,
 Typography,
} from "@mui/material";

// Mock data cho demo
const generateMockUsers = (count: number) => {
 const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng"];
 const middleNames = ["Văn", "Thị", "Minh", "Hoàng", "Thu", "Hồng", "Quang", "Thanh", "Ngọc", "Bảo"];
 const firstNames = ["An", "Bình", "Cường", "Dũng", "Hà", "Linh", "Nam", "Oanh", "Phương", "Quân"];
 const domains = ["gmail.com", "yahoo.com", "hotmail.com", "example.com"];
 const roles = ["admin", "user", "moderator"];
 const statuses = ["active", "inactive", "pending"];

 return Array.from({ length: count }, (_, index) => {
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const name = `${lastName} ${middleName} ${firstName}`;
  const email = `${name.toLowerCase().replace(/\s+/g, ".")}${index}@${
   domains[Math.floor(Math.random() * domains.length)]
  }`;

  return {
   id: index + 1,
   name,
   email,
   phone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
   role: roles[Math.floor(Math.random() * roles.length)] as
    | "admin"
    | "moderator"
    | "user",
   status: statuses[Math.floor(Math.random() * statuses.length)] as
    | "active"
    | "inactive"
    | "pending",
   createdAt: new Date(Date.now() - Math.random() * 31536000000), // Random date within last year
   lastLogin: new Date(Date.now() - Math.random() * 86400000 * 30), // Random date within last 30 days
  };
 });
};

const mockUsers = generateMockUsers(245);

const statusColors = {
 active: "success",
 inactive: "error",
 pending: "warning",
} as const;

const statusLabels = {
 active: "Hoạt động",
 inactive: "Tạm dừng",
 pending: "Chờ duyệt",
};

const roleColors = {
 admin: "error",
 moderator: "warning",
 user: "primary",
} as const;

const roleLabels = {
 admin: "Quản trị",
 moderator: "Điều hành",
 user: "Người dùng",
};

export default function SearchDemo() {
 return (
  <Box sx={{ p: 3 }}>
   <Typography variant="h4" gutterBottom>
    Demo Tìm kiếm & Phân trang
   </Typography>

   <Typography variant="body1" color="text.secondary" paragraph>
    Trang này demo component SearchableTable với {mockUsers.length} người dùng
    mẫu. Bạn có thể tìm kiếm theo tên, email, hoặc số điện thoại.
   </Typography>

   <Divider sx={{ my: 3 }} />

   <SearchableTable
    data={mockUsers}
    searchFields={["name", "email", "phone"]}
    itemsPerPage={15}
    searchPlaceholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
    emptyMessage="Không có người dùng nào"
    renderHeader={() => (
     <TableHead>
      <TableRow>
       <TableCell>ID</TableCell>
       <TableCell>Tên</TableCell>
       <TableCell>Email</TableCell>
       <TableCell>Số điện thoại</TableCell>
       <TableCell>Vai trò</TableCell>
       <TableCell>Trạng thái</TableCell>
       <TableCell>Lần cuối đăng nhập</TableCell>
       <TableCell>Thao tác</TableCell>
      </TableRow>
     </TableHead>
    )}
    renderRow={(user) => (
     <TableRow key={user.id}>
      <TableCell>{user.id}</TableCell>
      <TableCell>
       <Typography variant="body2" fontWeight="medium">
        {user.name}
       </Typography>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>
       <Chip
        label={roleLabels[user.role]}
        color={roleColors[user.role]}
        size="small"
        variant="outlined"
       />
      </TableCell>
      <TableCell>
       <Chip
        label={statusLabels[user.status]}
        color={statusColors[user.status]}
        size="small"
       />
      </TableCell>
      <TableCell>
       <Typography variant="body2" color="text.secondary">
        {user.lastLogin.toLocaleDateString("vi-VN")}
       </Typography>
      </TableCell>
      <TableCell>
       <IconButton size="small" color="primary">
        <Visibility />
       </IconButton>
       <IconButton size="small" color="warning">
        <Edit />
       </IconButton>
       <IconButton size="small" color="error">
        <Delete />
       </IconButton>
      </TableCell>
     </TableRow>
    )}
   />

   <Box sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom>
     💡 Hướng dẫn sử dụng
    </Typography>
    <Typography variant="body2" paragraph>
     • <strong>Tìm kiếm:</strong> Nhập từ khóa vào ô tìm kiếm để lọc dữ liệu
     theo tên, email hoặc số điện thoại
    </Typography>
    <Typography variant="body2" paragraph>
     • <strong>Phân trang:</strong> Sử dụng các nút điều hướng để chuyển trang
     hoặc thay đổi số items trên mỗi trang
    </Typography>
    <Typography variant="body2" paragraph>
     • <strong>Xóa tìm kiếm:</strong> Click vào icon X trong ô tìm kiếm để xóa
     bộ lọc
    </Typography>
    <Typography variant="body2">
     • <strong>Tổ hợp:</strong> Component này kết hợp tìm kiếm và phân trang một
     cách mượt mà
    </Typography>
   </Box>
  </Box>
 );
}
    <Typography variant="body2" paragraph>
     • <strong>Tìm kiếm:</strong> Nhập từ khóa vào ô tìm kiếm để lọc dữ liệu
     theo tên, email hoặc số điện thoại
    </Typography>
    <Typography variant="body2" paragraph>
     • <strong>Phân trang:</strong> Sử dụng các nút điều hướng để chuyển trang
     hoặc thay đổi số items trên mỗi trang
    </Typography>
    <Typography variant="body2" paragraph>
     • <strong>Xóa tìm kiếm:</strong> Click vào icon X trong ô tìm kiếm để xóa
     bộ lọc
    </Typography>
    <Typography variant="body2">
     • <strong>Tổ hợp:</strong> Component này kết hợp tìm kiếm và phân trang một
     cách mượt mà
    </Typography>
   </Box>
  </Box>
 );
}
