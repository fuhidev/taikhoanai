# taikhoanai.io.vn Management System

Hệ thống quản lý bán tài khoản truy cập nền tảng AI (ChatGPT, Gemini, Leonardo, Hailuo...)

## 🎉 TRẠNG THÁI: HOÀN THÀNH

### ✅ Đã hoàn thành:

- ✅ Next.js Web Application với Material-UI
- ✅ 5 trang quản lý: Dashboard, Users, Products, Orders, Subscriptions
- ✅ Chrome Extension với Manifest V3
- ✅ Firebase configuration và services
- ✅ TypeScript definitions cho toàn bộ hệ thống
- ✅ API routes cho extension authentication
- ✅ Build process hoàn chỉnh
- ✅ Development server đang chạy tại http://localhost:3000

### ⏳ Cần thực hiện:

- 🔧 Cấu hình Firebase project (thay đổi .env.local)
- 🧪 Test Chrome extension
- 🚀 Deploy production

## Cấu trúc dự án

- `/app` - Next.js web application (trang quản lý)
  - `/api` - API routes cho extension
  - `/users` - Quản lý người dùng
  - `/products` - Quản lý sản phẩm AI
  - `/orders` - Quản lý đơn hàng
  - `/subscriptions` - Quản lý subscription
- `/extension` - Chrome extension (đã build thành công)
  - `/src` - Source code
  - `/dist` - Built extension ready to install
- `/lib` - Firebase services và utilities
- `/components` - React components với Material-UI
- `/types` - TypeScript type definitions

## Tính năng

### Web Application (Trang quản lý)

- 📊 Dashboard với thống kê tổng quan
- 👥 Quản lý người dùng (CRUD operations)
- 🎯 Quản lý sản phẩm AI với cookie management
- 🛒 Quản lý đơn hàng và tracking
- 📋 Quản lý subscription của người dùng
- 🔐 API authentication cho extension

### Chrome Extension

- 🔑 Đăng nhập người dùng với username/password
- 🍪 Tự động inject cookie vào website AI
- 🌐 Hỗ trợ multi-platform (ChatGPT, Gemini, Leonardo, Hailuo...)
- ⚡ Background service worker
- 🔍 Kiểm tra quyền truy cập real-time

## Cài đặt và Chạy

### 1. Main Application (Đã cài đặt)

```bash
npm install  # ✅ Đã thực hiện
npm run dev  # ✅ Đang chạy tại http://localhost:3000
```

### 2. Chrome Extension (Đã build)

```bash
cd extension
npm install  # ✅ Đã thực hiện
npm run build  # ✅ Đã build thành công
```

### 3. Cài đặt Extension vào Chrome

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật "Developer mode"
3. Click "Load unpacked"
4. Chọn thư mục `extension/dist`

### 4. Cấu hình Firebase

Cập nhật file `.env.local` với thông tin Firebase project:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Sử dụng

### Web Application

1. 🌐 Truy cập http://localhost:3000
2. 📋 Sử dụng navigation tabs để quản lý:
   - Dashboard: Thống kê tổng quan
   - Users: Thêm/sửa/xóa người dùng
   - Products: Quản lý sản phẩm AI và cookies
   - Orders: Theo dõi đơn hàng
   - Subscriptions: Quản lý subscription

### Chrome Extension

1. 📦 Click icon extension trên toolbar
2. 🔐 Đăng nhập với username/password
3. 🌐 Truy cập website AI (ChatGPT, Gemini...)
4. 🍪 Extension tự động inject cookies
5. 🚪 Logout khi cần thiết

## API Endpoints

- `POST /api/login` - Authentication cho extension
- `GET /api/product-access` - Lấy thông tin sản phẩm và cookies

## Technical Stack

- ⚛️ **Frontend**: Next.js 14 + TypeScript + Material-UI
- 🔥 **Backend**: Firebase Firestore
- 🌐 **Extension**: Chrome Manifest V3 + TypeScript
- 📦 **Build**: Webpack + Next.js compiler
- 🎨 **UI**: Material-UI với responsive design

## Hỗ trợ Platforms

- 🤖 ChatGPT (chat.openai.com)
- 💎 Google Gemini (gemini.google.com)
- 🎨 Leonardo AI (leonardo.ai)
- 🚀 Hailuo AI (hailuoai.com)
- ➕ Dễ dàng mở rộng cho platforms khác
