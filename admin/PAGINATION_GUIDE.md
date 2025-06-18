# Hệ thống phân trang (Pagination System)

Hệ thống phân trang tái sử dụng cho ứng dụng admin với Material-UI và Next.js.

## Thành phần chính

### 1. Hook `usePagination`

Hook cung cấp logic phân trang cơ bản:

```typescript
import { usePagination } from "@/hooks/usePagination";

const pagination = usePagination({
 data: items,
 itemsPerPage: 10,
 initialPage: 1,
});
```

**Props:**

- `data`: Array dữ liệu cần phân trang
- `itemsPerPage`: Số items trên mỗi trang (mặc định: 10)
- `initialPage`: Trang khởi tạo (mặc định: 1)

**Returns:**

- `currentItems`: Items hiện tại của trang
- `currentPage`: Trang hiện tại
- `totalPages`: Tổng số trang
- `totalItems`: Tổng số items
- `goToPage(page)`: Chuyển đến trang
- `nextPage()`: Trang tiếp theo
- `prevPage()`: Trang trước
- `setItemsPerPage(items)`: Thay đổi số items trên trang

### 2. Component `Pagination`

Component UI để điều khiển phân trang:

```tsx
import Pagination from "@/components/Pagination";

<Pagination
 currentPage={currentPage}
 totalPages={totalPages}
 totalItems={totalItems}
 itemsPerPage={itemsPerPage}
 startIndex={startIndex}
 endIndex={endIndex}
 hasNextPage={hasNextPage}
 hasPrevPage={hasPrevPage}
 onPageChange={onPageChange}
 onItemsPerPageChange={onItemsPerPageChange}
 pageSizeOptions={[5, 10, 25, 50, 100]}
 showFirstLast={true}
 showPageSizeSelector={true}
/>;
```

### 3. Component `PaginatedTable`

Component table có sẵn phân trang:

```tsx
import PaginatedTable from "@/components/PaginatedTable";

<PaginatedTable
 data={users}
 loading={loading}
 itemsPerPage={10}
 emptyMessage="Không có dữ liệu"
 renderHeader={() => (
  <TableHead>
   <TableRow>
    <TableCell>Tên</TableCell>
    <TableCell>Email</TableCell>
    <TableCell>Thao tác</TableCell>
   </TableRow>
  </TableHead>
 )}
 renderRow={(user) => (
  <TableRow key={user.id}>
   <TableCell>{user.name}</TableCell>
   <TableCell>{user.email}</TableCell>
   <TableCell>
    <Button onClick={() => editUser(user)}>Sửa</Button>
   </TableCell>
  </TableRow>
 )}
/>;
```

### 4. Component `PaginationWrapper`

Wrapper linh hoạt cho bất kỳ layout nào:

```tsx
import PaginationWrapper from "@/components/PaginationWrapper";

<PaginationWrapper data={items} itemsPerPage={12}>
 {(currentItems, startIndex) => (
  <Grid container spacing={2}>
   {currentItems.map((item, index) => (
    <Grid item xs={12} sm={6} md={4} key={item.id}>
     <Card>
      <CardContent>
       <Typography>{item.name}</Typography>
      </CardContent>
     </Card>
    </Grid>
   ))}
  </Grid>
 )}
</PaginationWrapper>;
```

## Cách sử dụng

### Phân trang cơ bản với hook

```tsx
import { usePagination } from "@/hooks/usePagination";

function MyComponent() {
 const [items, setItems] = useState([]);

 const pagination = usePagination({
  data: items,
  itemsPerPage: 20,
 });

 return (
  <div>
   {/* Render current items */}
   {pagination.currentItems.map((item) => (
    <div key={item.id}>{item.name}</div>
   ))}

   {/* Pagination controls */}
   <Pagination {...pagination} />
  </div>
 );
}
```

### Table với phân trang sẵn có

```tsx
import PaginatedTable from "@/components/PaginatedTable";

function UsersTable() {
 const [users, setUsers] = useState([]);
 const [loading, setLoading] = useState(false);

 return (
  <PaginatedTable
   data={users}
   loading={loading}
   itemsPerPage={15}
   renderHeader={() => (
    <TableHead>
     <TableRow>
      <TableCell>ID</TableCell>
      <TableCell>Tên</TableCell>
      <TableCell>Email</TableCell>
      <TableCell>Thao tác</TableCell>
     </TableRow>
    </TableHead>
   )}
   renderRow={(user) => (
    <TableRow key={user.id}>
     <TableCell>{user.id}</TableCell>
     <TableCell>{user.name}</TableCell>
     <TableCell>{user.email}</TableCell>
     <TableCell>
      <IconButton onClick={() => editUser(user)}>
       <Edit />
      </IconButton>
     </TableCell>
    </TableRow>
   )}
  />
 );
}
```

## Tính năng

- ✅ **Tái sử dụng cao**: Components và hooks có thể dùng cho nhiều trang khác nhau
- ✅ **TypeScript**: Hỗ trợ đầy đủ TypeScript với generic types
- ✅ **Material-UI**: Tích hợp hoàn toàn với Material-UI design system
- ✅ **Responsive**: Giao diện responsive trên mọi thiết bị
- ✅ **Customizable**: Có thể tùy chỉnh số items trên trang, style, v.v.
- ✅ **Loading states**: Hỗ trợ hiển thị trạng thái loading
- ✅ **Empty states**: Hiển thị thông báo khi không có dữ liệu
- ✅ **Performance**: Chỉ render items hiện tại, tránh lag với dataset lớn

## Đã áp dụng cho các trang

- ✅ `/users` - Quản lý người dùng
- ✅ `/products` - Quản lý sản phẩm
- ✅ `/orders` - Quản lý đơn hàng

## Mở rộng

### Thêm tính năng sorting

```tsx
// Hook custom với sorting
function usePaginationWithSort<T>(data: T[], sortField?: keyof T) {
 const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

 const sortedData = useMemo(() => {
  if (!sortField) return data;

  return [...data].sort((a, b) => {
   if (sortDirection === "asc") {
    return a[sortField] > b[sortField] ? 1 : -1;
   }
   return a[sortField] < b[sortField] ? 1 : -1;
  });
 }, [data, sortField, sortDirection]);

 const pagination = usePagination({ data: sortedData });

 return {
  ...pagination,
  sortDirection,
  setSortDirection,
 };
}
```

### Thêm search/filter

```tsx
// Hook với search
function usePaginationWithSearch<T>(data: T[], searchField: keyof T) {
 const [searchTerm, setSearchTerm] = useState("");

 const filteredData = useMemo(() => {
  if (!searchTerm) return data;

  return data.filter((item) =>
   String(item[searchField]).toLowerCase().includes(searchTerm.toLowerCase())
  );
 }, [data, searchTerm, searchField]);

 const pagination = usePagination({ data: filteredData });

 return {
  ...pagination,
  searchTerm,
  setSearchTerm,
 };
}
```

## Best Practices

1. **Sử dụng `PaginatedTable`** cho hầu hết các trường hợp table đơn giản
2. **Sử dụng `PaginationWrapper`** khi cần layout custom (grid, cards, v.v.)
3. **Sử dụng `usePagination` hook** khi cần control hoàn toàn
4. **Đặt `itemsPerPage` phù hợp**: 10-15 cho table, 20-50 cho cards
5. **Luôn cung cấp `emptyMessage`** có ý nghĩa
6. **Sử dụng `loading` state** để UX tốt hơn
7. **Memo hóa data** nếu data được tính toán phức tạp
