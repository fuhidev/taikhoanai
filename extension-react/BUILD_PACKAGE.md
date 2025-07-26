# Chrome Extension Build & Package

Scripts tự động build và đóng gói Chrome extension thành file zip với tên theo format `taikhoanai.io.vn-v{version}.zip`.

## Cách sử dụng

### Windows

#### Phương pháp 1: Sử dụng PowerShell Script (Khuyến nghị)

```bash
# Build với version hiện tại trong manifest.json
npm run package

# Build và cập nhật version mới
npm run package:version 1.2.3
```

#### Phương pháp 2: Sử dụng Batch File

```bash
# Chạy trực tiếp file .bat
.\build-and-package.bat

# Hoặc double-click vào file build-and-package.bat
```

#### Phương pháp 3: Chạy PowerShell trực tiếp

```powershell
# Build với version hiện tại
.\build-and-package.ps1

# Build với version mới
.\build-and-package.ps1 -Version "1.2.3"
```

### Linux/macOS

```bash
# Build với version hiện tại
npm run package:linux

# Build với version mới
npm run package:version:linux 1.2.3

# Hoặc chạy trực tiếp
./build-and-package.sh
./build-and-package.sh --version 1.2.3
```

## Các bước thực hiện

1. **Đọc version** từ `public/manifest.json`
2. **Cập nhật version** (nếu được chỉ định)
3. **Build extension** bằng `npm run build`
4. **Đổi tên** thư mục `dist` thành `taikhoanai.io.vn-v{version}`
5. **Tạo file zip** `taikhoanai.io.vn-v{version}.zip`
6. **Dọn dẹp** thư mục tạm thời

## Output

- **File zip**: `taikhoanai.io.vn-v{version}.zip`
- **Vị trí**: Thư mục gốc của project
- **Sẵn sàng upload** lên Chrome Web Store

## Ví dụ

Với version `1.2.3` trong manifest.json:

- Thư mục được tạo: `taikhoanai.io.vn-v1.2.3/`
- File zip: `taikhoanai.io.vn-v1.2.3.zip`

## Yêu cầu

### Windows

- PowerShell 5.0+ (có sẵn trong Windows 10/11)
- Node.js và npm

### Linux/macOS

- bash
- zip utility
- Node.js và npm

## Lưu ý

- Script sẽ tự động xóa file zip cũ nếu đã tồn tại
- Thư mục tạm thời sẽ được dọn dẹp sau khi tạo zip
- Nếu build thất bại, script sẽ dừng lại và báo lỗi
