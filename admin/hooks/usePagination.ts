import { useCallback, useMemo, useState } from "react";

interface UsePaginationProps<T> {
 data: T[];
 itemsPerPage?: number;
 initialPage?: number;
}

interface UsePaginationReturn<T> {
 // Current data slice for the page
 currentItems: T[];

 // Pagination info
 currentPage: number;
 totalPages: number;
 totalItems: number;
 itemsPerPage: number;

 // Navigation functions
 goToPage: (page: number) => void;
 nextPage: () => void;
 prevPage: () => void;
 setItemsPerPage: (items: number) => void;

 // Utility states
 hasNextPage: boolean;
 hasPrevPage: boolean;
 startIndex: number;
 endIndex: number;
}

export function usePagination<T>({
 data,
 itemsPerPage = 10,
 initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
 const [currentPage, setCurrentPage] = useState(initialPage);
 const [pageSize, setPageSize] = useState(itemsPerPage);

 // Calculate pagination values
 const totalItems = data.length;
 const totalPages = Math.ceil(totalItems / pageSize);
 const startIndex = (currentPage - 1) * pageSize;
 const endIndex = Math.min(startIndex + pageSize, totalItems);

 // Get current page items
 const currentItems = useMemo(() => {
  return data.slice(startIndex, endIndex);
 }, [data, startIndex, endIndex]);

 // Navigation utilities
 const hasNextPage = currentPage < totalPages;
 const hasPrevPage = currentPage > 1;

 // Navigation functions
 const goToPage = useCallback(
  (page: number) => {
   const validPage = Math.max(1, Math.min(page, totalPages));
   setCurrentPage(validPage);
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

 const setItemsPerPage = useCallback((items: number) => {
  setPageSize(items);
  // Reset to first page when changing page size
  setCurrentPage(1);
 }, []);

 return {
  currentItems,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage: pageSize,
  goToPage,
  nextPage,
  prevPage,
  setItemsPerPage,
  hasNextPage,
  hasPrevPage,
  startIndex,
  endIndex,
 };
}
