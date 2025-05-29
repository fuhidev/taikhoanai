import {
 authenticateUser,
 createUserSession,
 getUserActiveSessions,
} from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
  const body = await request.json();
  const { phoneNumber, password, deviceInfo, deviceId } = body;

  if (!phoneNumber || !password) {
   return NextResponse.json(
    { success: false, message: "Thiếu số điện thoại hoặc mật khẩu" },
    { status: 400 }
   );
  }

  const result = await authenticateUser({ phoneNumber, password });

  if (!result.success) {
   return NextResponse.json(result);
  }

  const user = result.user!;
  // Nếu có deviceInfo và deviceId, xử lý session management
  if (deviceInfo && deviceId) {
   // Kiểm tra đã có ai đăng nhập chưa?
   const activeSessions = await getUserActiveSessions(user.id);

   if (activeSessions.length > 0) {
    // Đã có thiết bị khác đăng nhập → CHẶN
    const activeDevice = activeSessions[0];
    return NextResponse.json({
     success: false,
     message: `Tài khoản đã đăng nhập trên thiết bị: ${activeDevice.deviceInfo.deviceName}. Chỉ được phép đăng nhập trên một thiết bị.`,
     deviceConflict: true,
     activeDevice: {
      deviceName: activeDevice.deviceInfo.deviceName,
      loginTime: activeDevice.loginTime,
      lastActive: activeDevice.lastActive,
     },
    });
   }

   // Chưa có ai đăng nhập → Tạo session mới và cho phép đăng nhập
   const sessionId = await createUserSession(user.id, {
    ...deviceInfo,
    deviceId,
    ip: request.ip || "unknown",
   });

   return NextResponse.json({
    success: true,
    user,
    sessionId,
    message: "Đăng nhập thành công",
   });
  }

  // Trả về kết quả login thông thường (cho admin panel)
  return NextResponse.json(result);
 } catch (error) {
  console.error("Login error:", error);
  return NextResponse.json(
   { success: false, message: "Có lỗi xảy ra" },
   { status: 500 }
  );
 }
}
