# Environment Configuration Guide

## Overview

Dự án này hỗ trợ 2 môi trường khác nhau với các API endpoints tương ứng:

- **Development**: `http://localhost:3000/api`
- **Production**: `https://portal.taikhoanai.io.vn/api`

## Environment Files

### `.env` (Default)

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### `.env.development`

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### `.env.production`

```
VITE_API_BASE_URL=https://portal.taikhoanai.io.vn/api
```

## Build Commands

### Development Build

```bash
# Build cho development environment
npm run build:dev

# Build và package cho development
npm run package:dev

# Watch mode cho development
npm run watch:dev
```

### Production Build

```bash
# Build cho production environment
npm run build:prod

# Build và package cho production
npm run package:prod

# Watch mode cho production
npm run watch:prod
```

### Default Build (sử dụng .env)

```bash
# Build với config mặc định
npm run build

# Package với config mặc định
npm run package
```

## Output Files

- **Development**: `taikhoanai.io.vn-v1.0.1-dev.zip`
- **Production**: `taikhoanai.io.vn-v1.0.1.zip`

## Manifests

### Development Manifest (`manifest.dev.json`)

- Tên: "taikhoanai.io.vn (Development)"
- Version có suffix "-dev"
- Có host_permissions cho localhost
- Icon màu cam để dễ phân biệt

### Production Manifest (`manifest.prod.json`)

- Tên: "taikhoanai.io.vn"
- Version chính thức
- Không có localhost permissions (chỉ production domains)
- Icon tiêu chuẩn màu xanh
- Optimized cho môi trường production

## Automatic Configuration

Khi build, hệ thống sẽ tự động:

1. **Copy manifest phù hợp** dựa trên mode
2. **Set environment variables** từ file .env tương ứng
3. **Log API base URL** để debug
4. **Tạo package với tên phù hợp**

## Usage Examples

```bash
# Development workflow
npm run build:dev    # Builds với localhost API
npm run package:dev  # Tạo taikhoanai.io.vn-v1.0.1-dev.zip

# Production workflow
npm run build:prod   # Builds với production API
npm run package:prod # Tạo taikhoanai.io.vn-v1.0.1.zip

# Watch during development
npm run watch:dev    # Auto rebuild khi code thay đổi
```

## Debugging

Check console logs để xác nhận API base URL đang được sử dụng:

```
Extension using API base URL: http://localhost:3000/api
VersionChecker using API base URL: http://localhost:3000/api
Building in mode: development
Copied manifest for development mode
```

## Notes

- Environment variables chỉ có thể truy cập từ build time, không runtime
- Manifest sẽ được copy tự động khi build
- Development build có icon và tên khác để dễ phân biệt
- Production build không có permissions cho localhost
