import { createUser, updateUserAdmin } from "./lib/firebaseService";

async function createAdminUser() {
 try {
  // Tạo user admin...

  // Tạo user admin với số điện thoại và mật khẩu
  const adminUserId = await createUser("0123456789", "admin123");

  // Set quyền admin
  await updateUserAdmin(adminUserId, true);

  // User admin đã được tạo với ID: ${adminUserId}
  // Thông tin đăng nhập:
  // Số điện thoại: 0123456789
  // Mật khẩu: admin123
 } catch (error) {
  // Lỗi khi tạo user admin: ${error}
 }
}

createAdminUser();
