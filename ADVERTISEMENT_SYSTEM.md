# Hệ thống Quảng cáo Popup

## Mô tả

Hệ thống quảng cáo popup tự động hiển thị quảng cáo cho người dùng khi truy cập website, với khả năng quản lý từ admin panel.

## Tính năng

### Admin Panel

- ✅ Quản lý danh sách quảng cáo (CRUD)
- ✅ Upload/quản lý hình ảnh quảng cáo
- ✅ Bật/tắt trạng thái quảng cáo
- ✅ Thiết lập độ ưu tiên hiển thị
- ✅ Preview quảng cáo trước khi publish

### Shop Frontend

- ✅ Tự động hiển thị popup sau 5 giây
- ✅ Hiển thị theo thứ tự ưu tiên
- ✅ Lưu trạng thái dismiss trong 24h
- ✅ Tự động chuyển sang quảng cáo tiếp theo
- ✅ Responsive design

## Cách sử dụng

### 1. Cấu hình Firebase

Tạo file `.env.local` trong thư mục `shop` với nội dung:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 2. Quản lý quảng cáo trong Admin

1. Truy cập `/advertisements` trong admin panel
2. Click "Thêm quảng cáo" để tạo quảng cáo mới
3. Nhập thông tin:
   - **Tên quảng cáo**: Tên để nhận diện
   - **URL hình ảnh**: Link đến hình ảnh quảng cáo
   - **Độ ưu tiên**: Số càng cao càng được ưu tiên hiển thị
4. Bật/tắt trạng thái active
5. Sử dụng nút Preview để xem trước

### 3. Cách hoạt động trên Shop

1. User truy cập trang chủ
2. Sau 5 giây, popup quảng cáo đầu tiên hiển thị
3. User có thể đóng popup bằng nút X
4. Quảng cáo đã đóng sẽ không hiển thị lại trong 24h
5. Khi user quay lại, quảng cáo tiếp theo sẽ hiển thị

## Cấu trúc dữ liệu Firebase

### Collection: `advertisements`

```typescript
{
  id: string,
  name: string,           // Tên quảng cáo
  imageUrl: string,       // URL hình ảnh
  isActive: boolean,      // Trạng thái hoạt động
  priority: number,       // Độ ưu tiên (cao = ưu tiên)
  createdAt: timestamp,   // Ngày tạo
  updatedAt: timestamp    // Ngày cập nhật
}
```

## API Endpoints

### Admin APIs

- `GET /api/advertisements` - Lấy danh sách quảng cáo
- `GET /api/advertisements?active=true` - Lấy quảng cáo đang active
- `POST /api/advertisements` - Tạo quảng cáo mới
- `PUT /api/advertisements/[id]` - Cập nhật quảng cáo
- `DELETE /api/advertisements/[id]` - Xóa quảng cáo

## LocalStorage Structure

```javascript
{
  "dismissedAds": {
    "ad_id_1": timestamp,
    "ad_id_2": timestamp
  }
}
```

## Customization

### Thay đổi thời gian hiển thị

Sửa file `src/hooks/useAdvertisements.ts`:

```typescript
// Thay đổi 5000ms thành thời gian mong muốn
setTimeout(() => {
 setShowPopup(true);
}, 5000);
```

### Thay đổi thời gian dismiss

```typescript
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 giờ
```

### Custom styling

Chỉnh sửa CSS trong `src/components/AdPopup.tsx`

## Troubleshooting

### Popup không hiển thị

1. Kiểm tra Firebase config
2. Đảm bảo có quảng cáo active
3. Xóa localStorage để reset dismiss state

### Hình ảnh không load

1. Kiểm tra URL hình ảnh hợp lệ
2. Đảm bảo CORS được cấu hình đúng
3. Sử dụng CDN ổn định cho hình ảnh
