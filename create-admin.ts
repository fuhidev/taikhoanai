import { createUser, updateUserAdmin } from "./lib/firebaseService";

async function createAdminUser() {
 try {
  console.log("Tạo user admin...");

  // Tạo user admin với số điện thoại và mật khẩu
  const adminUserId = await createUser("0123456789", "admin123");

  // Set quyền admin
  await updateUserAdmin(adminUserId, true);

  console.log(`User admin đã được tạo với ID: ${adminUserId}`);
  console.log("Thông tin đăng nhập:");
  console.log("Số điện thoại: 0123456789");
  console.log("Mật khẩu: admin123");
 } catch (error) {
  console.error("Lỗi khi tạo user admin:", error);
 }
}

createAdminUser();
