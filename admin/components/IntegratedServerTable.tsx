"use client";

import { Pagination } from "@/components";
import { PaginatedResult, PaginationOptions } from "@/types";
import {
 Alert,
 Box,
 CircularProgress,
 Paper,
 Table,
 TableBody,
 TableContainer,
 Typography,
} from "@mui/material";
import React, {
 forwardRef,
 useCallback,
 useEffect,
 useImperativeHandle,
 useState,
} from "react";

interface IntegratedServerTableProps<T> {
 // Data fetching
 fetchFunction: (options: PaginationOptions) => Promise<PaginatedResult<T>>;

 // Pagination options
 initialPage?: number;
 initialLimit?: number;
 orderByField?: string;
 orderDirection?: "asc" | "desc";

 // Rendering
 renderHeader: () => React.ReactNode;
 renderRow: (item: T, index: number) => React.ReactNode;

 // Optional props
 title?: string;
 emptyMessage?: string;

 // Refresh trigger - when this changes, data will be refetched
 refreshKey?: string | number;

 // Callback when data changes (optional)
 onDataChange?: (data: T[], pagination: PaginatedResult<T>) => void;
}

export interface IntegratedServerTableRef<T = unknown> {
 refresh: () => void;
 goToPage: (page: number) => void;
 nextPage: () => void;
 prevPage: () => void;
 changeItemsPerPage: (newLimit: number) => void;
 getCurrentData: () => T[];
 getCurrentPage: () => number;
 getTotalPages: () => number;
 getTotalCount: () => number;
}

function IntegratedServerTableComponent<T>(
 {
  fetchFunction,
  initialPage = 1,
  initialLimit = 10,
  orderByField = "createdAt",
  orderDirection = "desc",
  renderHeader,
  renderRow,
  title,
  emptyMessage = "Không có dữ liệu",
  refreshKey,
  onDataChange,
 }: IntegratedServerTableProps<T>,
 ref: React.Ref<IntegratedServerTableRef<T>>
) {
 // Internal pagination state
 const [data, setData] = useState<T[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [currentPage, setCurrentPage] = useState(initialPage);
 const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
 const [totalCount, setTotalCount] = useState(0);
 const [totalPages, setTotalPages] = useState(0);
 const [hasNextPage, setHasNextPage] = useState(false);
 const [hasPrevPage, setHasPrevPage] = useState(false);

 const fetchData = useCallback(
  async (page: number, limit: number) => {
   setLoading(true);
   setError(null);

   try {
    const options: PaginationOptions = {
     page,
     limit,
     orderByField,
     orderDirection,
    };

    const result = await fetchFunction(options);

    setData(result.data);
    setTotalCount(result.totalCount);
    setTotalPages(result.totalPages);
    setHasNextPage(result.hasNextPage);
    setHasPrevPage(result.hasPrevPage);
    setCurrentPage(result.currentPage);

    // Call callback if provided
    if (onDataChange) {
     onDataChange(result.data, result);
    }
   } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
    setData([]);
   } finally {
    setLoading(false);
   }
  },
  [fetchFunction, orderByField, orderDirection, onDataChange]
 );

 // Fetch data when dependencies change
 useEffect(() => {
  fetchData(currentPage, itemsPerPage);
 }, [fetchData, currentPage, itemsPerPage, refreshKey]);

 // Public methods exposed through ref (if needed)
 const refresh = useCallback(() => {
  fetchData(currentPage, itemsPerPage);
 }, [fetchData, currentPage, itemsPerPage]);

 const goToPage = useCallback(
  (page: number) => {
   if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
   }
  },
  [totalPages]
 );

 const nextPage = useCallback(() => {
  if (hasNextPage) {
   setCurrentPage((prev) => prev + 1);
  }
 }, [hasNextPage]);

 const prevPage = useCallback(() => {
  if (hasPrevPage) {
   setCurrentPage((prev) => prev - 1);
  }
 }, [hasPrevPage]);

 const changeItemsPerPage = useCallback((newLimit: number) => {
  setItemsPerPage(newLimit);
  setCurrentPage(1); // Reset to first page
 }, []); // Expose methods for external use
 useImperativeHandle(ref, () => ({
  refresh,
  goToPage,
  nextPage,
  prevPage,
  changeItemsPerPage,
  getCurrentData: () => data,
  getCurrentPage: () => currentPage,
  getTotalPages: () => totalPages,
  getTotalCount: () => totalCount,
 }));

 // Calculated values
 const startIndex = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
 const endIndex = Math.min(currentPage * itemsPerPage, totalCount);

 if (error) {
  return (
   <Alert severity="error" sx={{ mt: 2 }}>
    {error}
   </Alert>
  );
 }

 return (
  <Box>
   {title && (
    <Typography variant="h4" gutterBottom>
     {title}
    </Typography>
   )}

   <TableContainer component={Paper}>
    <Table>
     {renderHeader()}
     <TableBody>
      {loading ? (
       <tr>
        <td colSpan={100} style={{ textAlign: "center", padding: "20px" }}>
         <CircularProgress />
        </td>
       </tr>
      ) : data.length === 0 ? (
       <tr>
        <td colSpan={100} style={{ textAlign: "center", padding: "20px" }}>
         <Typography variant="body2" color="text.secondary">
          {emptyMessage}
         </Typography>
        </td>
       </tr>
      ) : (
       data.map((item, index) => renderRow(item, index))
      )}
     </TableBody>
    </Table>
   </TableContainer>

   {totalCount > 0 && (
    <Box sx={{ mt: 2 }}>
     <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalCount}
      itemsPerPage={itemsPerPage}
      startIndex={startIndex}
      endIndex={endIndex}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      onPageChange={goToPage}
      onItemsPerPageChange={changeItemsPerPage}
     />
    </Box>
   )}
  </Box>
 );
}

const IntegratedServerTable = forwardRef(IntegratedServerTableComponent) as <T>(
 props: IntegratedServerTableProps<T> & {
  ref?: React.Ref<IntegratedServerTableRef<T>>;
 }
) => React.ReactElement;

export default IntegratedServerTable;
