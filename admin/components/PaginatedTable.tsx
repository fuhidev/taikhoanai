import { usePagination } from "@/hooks/usePagination";
import {
 Box,
 CircularProgress,
 Paper,
 PaperProps,
 Table,
 TableBody,
 TableContainer,
 TableProps,
 Typography,
} from "@mui/material";
import { ReactNode } from "react";
import Pagination from "./Pagination";

interface PaginatedTableProps<T> {
 data: T[];
 loading?: boolean;
 itemsPerPage?: number;
 pageSizeOptions?: number[];
 showFirstLast?: boolean;
 showPageSizeSelector?: boolean;
 emptyMessage?: string;
 renderHeader: () => ReactNode;
 renderRow: (item: T, index: number) => ReactNode;
 tableProps?: Omit<TableProps, "children">;
 containerProps?: Omit<PaperProps, "children">;
}

export default function PaginatedTable<T>({
 data,
 loading = false,
 itemsPerPage = 10,
 pageSizeOptions = [5, 10, 25, 50, 100],
 showFirstLast = true,
 showPageSizeSelector = true,
 emptyMessage = "Không có dữ liệu",
 renderHeader,
 renderRow,
 tableProps = {},
 containerProps = {},
}: PaginatedTableProps<T>) {
 const pagination = usePagination({
  data,
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
   <TableContainer>
    <Table {...tableProps}>
     {renderHeader()}
     <TableBody>
      {pagination.currentItems.length === 0 ? (
       <tr>
        <td colSpan={100} style={{ textAlign: "center", padding: "2rem" }}>
         <Typography variant="body2" color="text.secondary">
          {emptyMessage}
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

   {data.length > 0 && (
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
