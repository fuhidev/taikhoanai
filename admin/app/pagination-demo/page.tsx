"use client";

import PaginatedTable from "@/components/PaginatedTable";
import PaginationWrapper from "@/components/PaginationWrapper";
import { usePagination } from "@/hooks/usePagination";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
 Box,
 Card,
 CardContent,
 Chip,
 Divider,
 Grid,
 IconButton,
 Paper,
 TableCell,
 TableHead,
 TableRow,
 Typography,
} from "@mui/material";
import { useState } from "react";

// Mock data
const generateMockData = (count: number) => {
 return Array.from({ length: count }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  description: `Mô tả cho item số ${index + 1}`,
  price: Math.floor(Math.random() * 1000000) + 10000,
  category: ["Electronics", "Clothing", "Books", "Sports"][
   Math.floor(Math.random() * 4)
  ],
  status: ["active", "inactive"][Math.floor(Math.random() * 2)] as
   | "active"
   | "inactive",
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
 }));
};

const mockItems = generateMockData(157); // 157 items để test phân trang

export default function PaginationDemo() {
 const [loading, setLoading] = useState(false);

 // Demo 1: Table pagination
 const handleTestLoading = () => {
  setLoading(true);
  setTimeout(() => setLoading(false), 2000);
 };

 // Demo 2: Card grid với wrapper
 const cardPagination = usePagination({
  data: mockItems,
  itemsPerPage: 12,
 });

 return (
  <Box sx={{ p: 3 }}>
   <Typography variant="h4" gutterBottom>
    Demo Hệ thống Phân trang
   </Typography>

   <Typography variant="body1" color="text.secondary" paragraph>
    Trang này demo các component phân trang với {mockItems.length} items mẫu.
   </Typography>

   <Divider sx={{ my: 3 }} />

   {/* Demo 1: PaginatedTable */}
   <Box sx={{ mb: 6 }}>
    <Typography variant="h5" gutterBottom>
     1. PaginatedTable Component
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
     Table với phân trang tích hợp, loading state và empty state.
    </Typography>

    <Box sx={{ mb: 2 }}>
     <button onClick={handleTestLoading}>Test Loading State (2s)</button>
    </Box>

    <PaginatedTable
     data={mockItems}
     loading={loading}
     itemsPerPage={10}
     emptyMessage="Không có items nào"
     renderHeader={() => (
      <TableHead>
       <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Tên</TableCell>
        <TableCell>Mô tả</TableCell>
        <TableCell>Giá</TableCell>
        <TableCell>Danh mục</TableCell>
        <TableCell>Trạng thái</TableCell>
        <TableCell>Thao tác</TableCell>
       </TableRow>
      </TableHead>
     )}
     renderRow={(item) => (
      <TableRow key={item.id}>
       <TableCell>{item.id}</TableCell>
       <TableCell>{item.name}</TableCell>
       <TableCell>{item.description}</TableCell>
       <TableCell>{item.price.toLocaleString()}đ</TableCell>
       <TableCell>{item.category}</TableCell>
       <TableCell>
        <Chip
         label={item.status === "active" ? "Hoạt động" : "Tạm dừng"}
         color={item.status === "active" ? "success" : "default"}
         size="small"
        />
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
   </Box>

   <Divider sx={{ my: 3 }} />

   {/* Demo 2: PaginationWrapper với Grid */}
   <Box sx={{ mb: 6 }}>
    <Typography variant="h5" gutterBottom>
     2. PaginationWrapper với Grid Layout
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
     Wrapper linh hoạt cho layout card/grid với phân trang.
    </Typography>

    <PaginationWrapper
     data={mockItems}
     itemsPerPage={12}
     pageSizeOptions={[6, 12, 24, 48]}
    >
     {(currentItems, startIndex) => (
      <Grid container spacing={3}>
       {currentItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
         <Card sx={{ height: "100%" }}>
          <CardContent>
           <Typography variant="h6" gutterBottom>
            {item.name}
           </Typography>
           <Typography variant="body2" color="text.secondary" paragraph>
            {item.description}
           </Typography>
           <Box
            sx={{
             display: "flex",
             justifyContent: "space-between",
             alignItems: "center",
            }}
           >
            <Typography variant="h6" color="primary">
             {item.price.toLocaleString()}đ
            </Typography>
            <Chip label={item.category} variant="outlined" size="small" />
           </Box>
           <Typography variant="caption" color="text.secondary">
            Item #{startIndex + index + 1}
           </Typography>
          </CardContent>
         </Card>
        </Grid>
       ))}
      </Grid>
     )}
    </PaginationWrapper>
   </Box>

   <Divider sx={{ my: 3 }} />

   {/* Demo 3: usePagination Hook */}
   <Box sx={{ mb: 6 }}>
    <Typography variant="h5" gutterBottom>
     3. usePagination Hook (Custom Layout)
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
     Sử dụng hook trực tiếp để tạo layout tùy chỉnh.
    </Typography>

    <Paper sx={{ p: 2 }}>
     <Typography variant="h6" gutterBottom>
      Thống kê phân trang
     </Typography>
     <Grid container spacing={2}>
      <Grid item xs={6} sm={3}>
       <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h4" color="primary">
         {cardPagination.currentPage}
        </Typography>
        <Typography variant="body2">Trang hiện tại</Typography>
       </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
       <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h4" color="secondary">
         {cardPagination.totalPages}
        </Typography>
        <Typography variant="body2">Tổng trang</Typography>
       </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
       <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h4" color="success.main">
         {cardPagination.totalItems}
        </Typography>
        <Typography variant="body2">Tổng items</Typography>
       </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
       <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h4" color="warning.main">
         {cardPagination.itemsPerPage}
        </Typography>
        <Typography variant="body2">Items/trang</Typography>
       </Paper>
      </Grid>
     </Grid>

     <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
      <button
       onClick={cardPagination.prevPage}
       disabled={!cardPagination.hasPrevPage}
      >
       ← Trang trước
      </button>
      <button
       onClick={cardPagination.nextPage}
       disabled={!cardPagination.hasNextPage}
      >
       Trang sau →
      </button>
      <button onClick={() => cardPagination.goToPage(1)}>Trang đầu</button>
      <button
       onClick={() => cardPagination.goToPage(cardPagination.totalPages)}
      >
       Trang cuối
      </button>
     </Box>

     <Typography variant="body2" sx={{ mt: 2 }}>
      Hiển thị {cardPagination.startIndex + 1}-{cardPagination.endIndex} trong
      tổng số {cardPagination.totalItems} items
     </Typography>
    </Paper>
   </Box>
  </Box>
 );
}
