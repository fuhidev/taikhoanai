import { useSearchablePagination } from "@/hooks/useSearchablePagination";
import { Clear, Search } from "@mui/icons-material";
import {
 Box,
 CircularProgress,
 InputAdornment,
 Paper,
 PaperProps,
 Table,
 TableBody,
 TableContainer,
 TableProps,
 TextField,
 Typography,
} from "@mui/material";
import { ReactNode } from "react";
import Pagination from "./Pagination";

interface SearchableTableProps<T> {
 data: T[];
 searchFields: (keyof T)[];
 loading?: boolean;
 itemsPerPage?: number;
 pageSizeOptions?: number[];
 showFirstLast?: boolean;
 showPageSizeSelector?: boolean;
 emptyMessage?: string;
 searchPlaceholder?: string;
 renderHeader: () => ReactNode;
 renderRow: (item: T, index: number) => ReactNode;
 tableProps?: Omit<TableProps, "children">;
 containerProps?: Omit<PaperProps, "children">;
}

export default function SearchableTable<T>({
 data,
 searchFields,
 loading = false,
 itemsPerPage = 10,
 pageSizeOptions = [5, 10, 25, 50, 100],
 showFirstLast = true,
 showPageSizeSelector = true,
 emptyMessage = "Không có dữ liệu",
 searchPlaceholder = "Tìm kiếm...",
 renderHeader,
 renderRow,
 tableProps = {},
 containerProps = {},
}: SearchableTableProps<T>) {
 const pagination = useSearchablePagination({
  data,
  searchFields,
  itemsPerPage,
 });

 if (loading) {
  return (
   <Paper {...containerProps}>
    <Box
     sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 4,
     }}
    >
     <CircularProgress />
    </Box>
   </Paper>
  );
 }

 return (
  <Paper {...containerProps}>
   {/* Search Bar */}
   <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
    <TextField
     fullWidth
     variant="outlined"
     placeholder={searchPlaceholder}
     value={pagination.searchTerm}
     onChange={(e) => pagination.setSearchTerm(e.target.value)}
     InputProps={{
      startAdornment: (
       <InputAdornment position="start">
        <Search />
       </InputAdornment>
      ),
      endAdornment: pagination.searchTerm && (
       <InputAdornment
        position="end"
        sx={{ cursor: "pointer" }}
        onClick={pagination.clearSearch}
       >
        <Clear />
       </InputAdornment>
      ),
     }}
     size="small"
    />{" "}
    {pagination.searchTerm && (
     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      Tìm thấy {pagination.totalItems} kết quả cho &ldquo;
      {pagination.searchTerm}&rdquo;
     </Typography>
    )}
   </Box>

   {/* Table */}
   <TableContainer>
    <Table {...tableProps}>
     {renderHeader()}
     <TableBody>
      {pagination.currentItems.length === 0 ? (
       <tr>
        <td colSpan={100} style={{ textAlign: "center", padding: "2rem" }}>
         {" "}
         <Typography variant="body2" color="text.secondary">
          {pagination.searchTerm
           ? `Không tìm thấy kết quả cho &ldquo;${pagination.searchTerm}&rdquo;`
           : emptyMessage}
         </Typography>
        </td>
       </tr>
      ) : (
       pagination.currentItems.map((item, index) =>
        renderRow(item, pagination.startIndex + index)
       )
      )}
     </TableBody>
    </Table>
   </TableContainer>

   {/* Pagination */}
   {pagination.totalItems > 0 && (
    <Pagination
     currentPage={pagination.currentPage}
     totalPages={pagination.totalPages}
     totalItems={pagination.totalItems}
     itemsPerPage={pagination.itemsPerPage}
     startIndex={pagination.startIndex}
     endIndex={pagination.endIndex}
     hasNextPage={pagination.hasNextPage}
     hasPrevPage={pagination.hasPrevPage}
     onPageChange={pagination.goToPage}
     onItemsPerPageChange={pagination.setItemsPerPage}
     pageSizeOptions={pageSizeOptions}
     showFirstLast={showFirstLast}
     showPageSizeSelector={showPageSizeSelector}
    />
   )}
  </Paper>
 );
}
