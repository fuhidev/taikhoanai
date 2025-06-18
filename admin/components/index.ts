// Pagination system exports
export { usePagination } from "../hooks/usePagination";
export { useSearchablePagination } from "../hooks/useSearchablePagination";
export { default as IntegratedServerTable } from "./IntegratedServerTable";
export { default as PaginatedTable } from "./PaginatedTable";
export { default as Pagination } from "./Pagination";
export { default as PaginationWrapper } from "./PaginationWrapper";
export { default as SearchableTable } from "./SearchableTable";

// Utility type definitions for component props
interface UsePaginationProps<T> {
 data: T[];
 itemsPerPage?: number;
 initialPage?: number;
}

interface UsePaginationReturn<T> {
 currentItems: T[];
 currentPage: number;
 totalPages: number;
 totalItems: number;
 itemsPerPage: number;
 goToPage: (page: number) => void;
 nextPage: () => void;
 prevPage: () => void;
 setItemsPerPage: (items: number) => void;
 hasNextPage: boolean;
 hasPrevPage: boolean;
 startIndex: number;
 endIndex: number;
}

export type { UsePaginationProps, UsePaginationReturn };
