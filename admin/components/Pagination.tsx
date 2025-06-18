import {
 ChevronLeft,
 ChevronRight,
 FirstPage,
 LastPage,
} from "@mui/icons-material";
import {
 Box,
 FormControl,
 IconButton,
 InputLabel,
 MenuItem,
 Pagination as MuiPagination,
 Select,
 SelectChangeEvent,
 Stack,
 Typography,
} from "@mui/material";

interface PaginationProps {
 currentPage: number;
 totalPages: number;
 totalItems: number;
 itemsPerPage: number;
 startIndex: number;
 endIndex: number;
 hasNextPage: boolean;
 hasPrevPage: boolean;
 onPageChange: (page: number) => void;
 onItemsPerPageChange: (itemsPerPage: number) => void;
 pageSizeOptions?: number[];
 showFirstLast?: boolean;
 showPageSizeSelector?: boolean;
 size?: "small" | "medium" | "large";
}

export default function Pagination({
 currentPage,
 totalPages,
 totalItems,
 itemsPerPage,
 startIndex,
 endIndex,
 hasNextPage,
 hasPrevPage,
 onPageChange,
 onItemsPerPageChange,
 pageSizeOptions = [5, 10, 25, 50, 100],
 showFirstLast = true,
 showPageSizeSelector = true,
 size = "medium",
}: PaginationProps) {
 const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
  onItemsPerPageChange(Number(event.target.value));
 };

 const handleFirstPage = () => {
  onPageChange(1);
 };

 const handleLastPage = () => {
  onPageChange(totalPages);
 };

 const handlePrevPage = () => {
  if (hasPrevPage) {
   onPageChange(currentPage - 1);
  }
 };

 const handleNextPage = () => {
  if (hasNextPage) {
   onPageChange(currentPage + 1);
  }
 };

 if (totalItems === 0) {
  return (
   <Box
    sx={{
     display: "flex",
     justifyContent: "center",
     alignItems: "center",
     p: 2,
    }}
   >
    <Typography variant="body2" color="text.secondary">
     Không có dữ liệu
    </Typography>
   </Box>
  );
 }

 return (
  <Box
   sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
    flexWrap: "wrap",
    gap: 2,
   }}
  >
   {/* Left side - Items info */}
   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Typography variant="body2" color="text.secondary">
     Hiển thị {startIndex + 1}-{endIndex} trong tổng số {totalItems} mục
    </Typography>

    {showPageSizeSelector && (
     <FormControl size="small" variant="outlined">
      <InputLabel>Số dòng</InputLabel>
      <Select
       value={itemsPerPage}
       onChange={handlePageSizeChange}
       label="Số dòng"
       sx={{ minWidth: 80 }}
      >
       {pageSizeOptions.map((option) => (
        <MenuItem key={option} value={option}>
         {option}
        </MenuItem>
       ))}
      </Select>
     </FormControl>
    )}
   </Box>

   {/* Right side - Pagination controls */}
   <Stack direction="row" spacing={1} alignItems="center">
    {showFirstLast && (
     <IconButton
      onClick={handleFirstPage}
      disabled={!hasPrevPage}
      size={size}
      title="Trang đầu"
     >
      <FirstPage />
     </IconButton>
    )}

    <IconButton
     onClick={handlePrevPage}
     disabled={!hasPrevPage}
     size={size}
     title="Trang trước"
    >
     <ChevronLeft />
    </IconButton>

    <MuiPagination
     count={totalPages}
     page={currentPage}
     onChange={(_, page) => onPageChange(page)}
     size={size}
     showFirstButton={false}
     showLastButton={false}
     siblingCount={1}
     boundaryCount={1}
    />

    <IconButton
     onClick={handleNextPage}
     disabled={!hasNextPage}
     size={size}
     title="Trang sau"
    >
     <ChevronRight />
    </IconButton>

    {showFirstLast && (
     <IconButton
      onClick={handleLastPage}
      disabled={!hasNextPage}
      size={size}
      title="Trang cuối"
     >
      <LastPage />
     </IconButton>
    )}
   </Stack>
  </Box>
 );
}
