import { useMemo, useState } from "react";
import { usePagination } from "./usePagination";

interface UseSearchablePaginationProps<T> {
 data: T[];
 searchFields?: (keyof T)[];
 itemsPerPage?: number;
 initialPage?: number;
}

interface UseSearchablePaginationReturn<T>
 extends ReturnType<typeof usePagination<T>> {
 searchTerm: string;
 setSearchTerm: (term: string) => void;
 filteredData: T[];
 clearSearch: () => void;
}

export function useSearchablePagination<T>({
 data,
 searchFields = [],
 itemsPerPage = 10,
 initialPage = 1,
}: UseSearchablePaginationProps<T>): UseSearchablePaginationReturn<T> {
 const [searchTerm, setSearchTerm] = useState("");

 // Filter data based on search term
 const filteredData = useMemo(() => {
  if (!searchTerm.trim() || searchFields.length === 0) {
   return data;
  }

  const lowercaseSearchTerm = searchTerm.toLowerCase();

  return data.filter((item) =>
   searchFields.some((field) => {
    const value = item[field];
    if (value === null || value === undefined) return false;

    return String(value).toLowerCase().includes(lowercaseSearchTerm);
   })
  );
 }, [data, searchTerm, searchFields]);

 // Use pagination with filtered data
 const pagination = usePagination({
  data: filteredData,
  itemsPerPage,
  initialPage,
 });

 const clearSearch = () => {
  setSearchTerm("");
 };

 return {
  ...pagination,
  searchTerm,
  setSearchTerm,
  filteredData,
  clearSearch,
 };
}
