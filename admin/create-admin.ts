import { createUser, updateUserAdmin } from "./lib/firebaseService";

async function createAdminUser() {
 try {
  // Tạo user admin với số điện thoại, mật khẩu và tên đầy đủ
  const adminUserId = await createUser(
   "0123456789",
   "admin123",
   "Quản trị viên hệ thống"
  );

  // Set quyền admin
  await updateUserAdmin(adminUserId, true);

  console.log(`User admin đã được tạo với ID: ${adminUserId}`);
  console.log("Thông tin đăng nhập:");
  console.log("Số điện thoại: 0123456789");
  console.log("Mật khẩu: admin123");
  console.log("Tên: Quản trị viên hệ thống");
 } catch (error) {
  console.error(`Lỗi khi tạo user admin: ${error}`);
 }
}

createAdminUser();
createAdminUser();
