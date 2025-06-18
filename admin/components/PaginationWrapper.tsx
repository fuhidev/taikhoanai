import { usePagination } from "@/hooks/usePagination";
import { Box } from "@mui/material";
import React from "react";
import Pagination from "./Pagination";

interface PaginationWrapperProps<T> {
 data: T[];
 itemsPerPage?: number;
 pageSizeOptions?: number[];
 showFirstLast?: boolean;
 showPageSizeSelector?: boolean;
 children: (items: T[], startIndex: number) => React.ReactNode;
}

export default function PaginationWrapper<T>({
 data,
 itemsPerPage = 10,
 pageSizeOptions = [5, 10, 25, 50, 100],
 showFirstLast = true,
 showPageSizeSelector = true,
 children,
}: PaginationWrapperProps<T>) {
 const pagination = usePagination({
  data,
  itemsPerPage,
 });

 return (
  <Box>
   {children(pagination.currentItems, pagination.startIndex)}

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
  </Box>
 );
}
