import { revokeSession } from "@/lib/firebaseService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
  // TODO: Add admin authentication check
  const { sessionId } = await request.json();

  if (!sessionId) {
   return NextResponse.json({
    success: false,
    message: "Thiếu session ID",
   });
  }

  await revokeSession(sessionId, "admin");

  return NextResponse.json({
   success: true,
   message: "Thu hồi phiên đăng nhập thành công",
  });
 } catch (error) {
  console.error("Error revoking session:", error);
  return NextResponse.json({
   success: false,
   message: "Lỗi server",
  });
 }
}
