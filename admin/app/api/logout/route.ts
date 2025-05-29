import { revokeSession } from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
  const { sessionId } = await request.json();

  if (!sessionId) {
   return NextResponse.json({
    success: false,
    message: "Thiếu session ID",
   });
  }

  await revokeSession(sessionId, "user");

  return NextResponse.json({
   success: true,
   message: "Đăng xuất thành công",
  });
 } catch (error) {
  console.error("Logout error:", error);
  return NextResponse.json({
   success: false,
   message: "Lỗi server",
  });
 }
}
